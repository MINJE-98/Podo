// SPDX-License-Identifier: MIT

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/IERC20.sol";

pragma solidity ^0.8.0;

contract FundRaise {
    using SafeMath for uint256;
    IERC20 public podo;

    // 그룹 정보
    struct GroupInfo {
        string name;
        string desc;
        ProjectInfo[] projects;
    }

    // 프로젝트
    struct ProjectInfo {
        string title;
        string desc;
        uint256 targetMoney;
        uint256 currentMoney;
        uint256 startBlock;
        uint256 endBlock;
    }
    BallotInterface public ballot;

    // 그룹 주소 -> 그룹 정보
    mapping(address => GroupInfo) public groupInfo;

    constructor(IERC20 _podo, address _ballot) {
        // 포도 컨트랙트 주입
        podo = _podo;
        // 투표 컨트랙트 주입
        ballot = BallotInterface(_ballot);
    }

    // 그룹을 가지고있는 사용자만 프로젝트를 생성할 수 있습니다.
    modifier onlyGroupOwner() {
        string memory empty = "";
        require(
            keccak256(bytes(groupInfo[msg.sender].name)) !=
                keccak256(bytes(empty)),
            "PODO: You don't have a group."
        );
        _;
    }

    /**
        그룹을 생성

        **조건
        _name, _desc가 비어있으면 안됨.
     */
    function createGroup(string memory _name, string memory _desc) public {
        string memory empty = "";
        require(
            keccak256(bytes(_name)) != keccak256(bytes(empty)) &&
                keccak256(bytes(_desc)) != keccak256(bytes(empty)),
            "PODO: Please input group name, desc."
        );
        // 메서드 호출자의 주소로 그룹을 생성
        groupInfo[msg.sender].name = _name;
        groupInfo[msg.sender].desc = _desc;
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
        string memory _title,
        string memory _desc,
        uint256 _targetMoney,
        uint256 _startBlock,
        uint256 _endBlock
    ) public {
        string memory empty = "";
        require(
            keccak256(bytes(_title)) != keccak256(bytes(empty)) &&
                keccak256(bytes(_desc)) != keccak256(bytes(empty)) &&
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
                title: _title,
                desc: _desc,
                targetMoney: _targetMoney,
                currentMoney: 0,
                startBlock: start,
                endBlock: end
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
        uint256 _pid,
        uint256 _amount
    ) public {
        // 존재하는 프로젝트인지 확인
        require(
            groupInfo[_group].projects.length - 1 >= _pid,
            "PODO: Not found group."
        );
        // 모금이 끝난 프로젝트인지 확인
        // require(
        //     groupInfo[_group].projects[_pid].endBlock <= nowBlock,
        //     "PODO: It's not a fundraising period."
        // );
        // 기부 금액이 0보다 커야함
        require(_amount > 0, "PODO: The donation amount cannot be zero.");
        // 기부의 금액을 모금 컨트랙트에 전송
        podo.transferFrom(address(msg.sender), address(this), _amount);
        // 기부자에게 투포권을 분배함
        ballot.mint(_group, _pid, address(msg.sender), _amount);
        // TODO 프론트 이벤트 추가
    }

    /**
        그룹의 모든 프로젝트 정보를 튜플로 반환합니다.
     */
    function viewGroupProjectsInfo(address _group)
        public
        view
        returns (ProjectInfo[] memory)
    {
        ProjectInfo[] memory projects = groupInfo[_group].projects;
        return projects;
        // TODO 프론트 이벤트 추가
    }

    /**
        그룹의 _pid에 해당하는 프로젝트 정보를 튜플로 반환합니다.
     */
    function viewGroupProjectInfo(address _group, uint256 _pid)
        public
        view
        returns (ProjectInfo memory)
    {
        return groupInfo[_group].projects[_pid];
        // TODO 프론트 이벤트 추가
    }
}

interface BallotInterface {
    function mint(
        address _group,
        uint256 _pid,
        address _to,
        uint256 _amount
    ) external;
}
