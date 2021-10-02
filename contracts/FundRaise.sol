// SPDX-License-Identifier: MIT

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/IERC20.sol";

pragma solidity ^0.8.0;

contract FundRaise {
    using SafeMath for uint256;

    IERC20 public podo;
    bytes32 public empty = keccak256(bytes(""));
    BallotInterface public ballot;

    // 그룹 정보
    struct GroupInfo {
        string groupName;
        string groupDesc;
        ProjectInfo[] projects;
    }

    // 프로젝트
    struct ProjectInfo {
        string projectName;
        string projectDesc;
        uint256 targetMoney;
        uint256 currentMoney;
        uint256 startBlock;
        uint256 endBlock;
        bool canceled;
    }
    // 모금 상태
    enum FundRaiseState {
        Pending,
        Active,
        Canceled,
        Ended
    }

    // 그룹 주소 -> 그룹 정보
    mapping(address => GroupInfo) public groupInfo;

    constructor(IERC20 _podo, BallotInterface _ballot) {
        // 포도 컨트랙트 주입
        podo = _podo;
        // 투표 컨트랙트 주입
        ballot = _ballot;
    }

    // 그룹을 가지고있는 사용자만 프로젝트를 생성할 수 있습니다.
    modifier onlyGroupOwner() {
        require(
            keccak256(bytes(groupInfo[msg.sender].groupName)) != empty,
            "PODO: You don't have a group."
        );
        _;
    }

    /**
        그룹을 생성

        **조건
        _name, _desc가 비어있으면 안됨.
     */
    function createGroup(string memory _groupName, string memory _groupDesc)
        public
    {
        // _name, _desc가 비어있으면 안됨.
        require(
            keccak256(bytes(_groupName)) != empty &&
                keccak256(bytes(_groupDesc)) != empty,
            "PODO: Please input group name, desc."
        );
        // 메서드 호출자의 주소로 그룹을 생성
        groupInfo[msg.sender].groupName = _groupName;
        groupInfo[msg.sender].groupDesc = _groupDesc;
        // TODO 프론트 이벤트 추가
    }

    /**
        모금활동을 등록
        모금활동을 등록하는 단체는 시작 시간과, 종료 시간을 선택 가능.

        **조건
        _title, _desc 는 비어있으면 안됨
        _targetmoney는 0보다 커야함
     */
    function createProject(
        string memory _projectName,
        string memory _projectDesc,
        uint256 _targetMoney,
        uint256 _startBlock,
        uint256 _endBlock
    ) public {
        require(
            keccak256(bytes(_projectName)) != empty &&
                keccak256(bytes(_projectDesc)) != empty &&
                _targetMoney >= 0,
            "PODO: Please input group name, desc, targetmony."
        );
        // 현재 블럭
        uint256 nowBlock = block.number;
        // 시작 시간을 정합니다.
        uint256 start = nowBlock.add(_startBlock);
        // 끝나는 시간을 정합니다.
        uint256 end = start.add(_endBlock);
        // 프로젝트에 데이터를 삽입
        groupInfo[msg.sender].projects.push(
            ProjectInfo({
                projectName: _projectName,
                projectDesc: _projectDesc,
                targetMoney: _targetMoney,
                currentMoney: 0,
                startBlock: start,
                endBlock: end,
                canceled: false
            })
        );
        // TODO 프론트 이벤트 추가
    }

    /**
            후원자들이 프로젝트에 기부

            **조건
            프로젝트가 존재해야함
            기부 금액이 0보다 커야함
         */

    function donateToProject(
        address _group,
        uint256 _projectID,
        uint256 _amount
    ) public {
        // 존재하는 프로젝트인지 확인
        require(
            groupInfo[_group].projects.length - 1 >= _projectID,
            "PODO: Not found project."
        );
        // 모금이 끝난 프로젝트인지 확인
        require(
            fundRaiseState(_group, _projectID) != FundRaiseState.Ended,
            "PODO: It's not a fundraising period."
        );
        // 기부 금액이 0보다 커야함
        require(_amount > 0, "PODO: The donation amount cannot be zero.");
        // 기부의 금액을 모금 컨트랙트에 전송
        podo.transferFrom(address(msg.sender), address(this), _amount);
        // 기부 받은 포도수 만큼 currentMoney에 추가시켜줌
        groupInfo[_group].projects[_projectID].currentMoney += _amount;
        // 기부자에게 투포권을 분배함
        ballot.mint(_group, _projectID, address(msg.sender), _amount);
        // TODO 프론트 이벤트 추가
    }

    /**
            그룹의 모든 프로젝트 정보를 튜플로 반환합니다.
         */
    function viewTotalProjects(address _group)
        public
        view
        returns (ProjectInfo[] memory)
    {
        ProjectInfo[] memory projects = groupInfo[_group].projects;
        return projects;
        // TODO 프론트 이벤트 추가
    }

    /**
            그룹의 _projectID에 해당하는 프로젝트 정보를 튜플로 반환합니다.
         */
    function viewOneProject(address _group, uint256 _projectID)
        public
        view
        returns (ProjectInfo memory)
    {
        return groupInfo[_group].projects[_projectID];
        // TODO 프론트 이벤트 추가
    }

    /**
        호출하는 주소가 그룹을 가지고있는지
     */
    function hasGroup() public view returns (bool) {
        GroupInfo memory group = groupInfo[msg.sender];
        if (keccak256(bytes(group.groupName)) != empty) {
            return true;
        }
        return false;
    }

    /**
        프로젝트의 존재여부
     */
    function hasProject(address _group, uint256 _projectID)
        public
        view
        returns (bool)
    {
        // 프로젝트가 존재하는 ID일 경우
        if (groupInfo[_group].projects.length - 1 <= _projectID) {
            return true;
        }
        return false;
    }

    /**
        현재 모금의 상태

        ** 조건
        프로젝트가 존재하는지 확인
     */
    function fundRaiseState(address _group, uint256 _projectID)
        public
        view
        returns (FundRaiseState)
    {
        // 프로젝트가 존재하는지 확인
        require(
            groupInfo[_group].projects.length - 1 >= _projectID,
            "PODO: Not found project."
        );
        // 프로젝트 정보 인스턴스 생성
        ProjectInfo memory project = groupInfo[_group].projects[_projectID];
        // 프로젝트 취소
        if (project.canceled) {
            return FundRaiseState.Canceled;
        }
        // 프로젝트 모금 대기
        else if (block.number <= project.startBlock) {
            return FundRaiseState.Pending;
        }
        // 프로젝트 모금 진행중
        else if (block.number <= project.endBlock) {
            return FundRaiseState.Active;
        }
        // 프로젝트 모금 종료
        else {
            return FundRaiseState.Ended;
        }
    }

    /**
        프로젝트의 모금 종료 여부
     */
    function isProjectEnd(address _group, uint256 _projectID)
        public
        view
        returns (bool)
    {
        // 프로젝트 정보 인스턴스 생성
        ProjectInfo memory project = groupInfo[_group].projects[_projectID];

        if (block.number >= project.endBlock) {
            return true;
        }
        return false;
    }
}

interface BallotInterface {
    function mint(
        address _group,
        uint256 _projectID,
        address _to,
        uint256 _amount
    ) external;
}
