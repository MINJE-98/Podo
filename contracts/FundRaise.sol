// SPDX-License-Identifier: MIT

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/IERC20.sol";
import "./Podo.sol";
import "./Ballot.sol";

pragma solidity ^0.8.0;

contract FundRaise is Ownable {
    using SafeMath for uint256;

    Ballot public ballot;
    Podo public podo;
    bytes32 public empty = keccak256(bytes(""));

    // 모금 기간
    function fundPeriod() public pure returns (uint256) {
        return 10;
        // return 17280;
    } // ~3 days in blocks (assuming 15s blocks)

    // 그룹 정보
    struct GroupInfo {
        string groupName;
        string groupDesc;
    }

    // 프로젝트
    struct ProjectInfo {
        string projectName;
        string projectDesc;
        uint256 targetMoney;
        uint256 currentMoney;
        uint256 startBlock;
        uint256 endBlock;
    }

    // 그룹 주소 -> 그룹 정보
    mapping(address => GroupInfo) public groupInfo;
    mapping(address => ProjectInfo) public projectInfo;

    constructor(Podo _podo, Ballot _ballot) {
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
    // 그룹이 생성되었음을 알림
    event CreatedGroup(string _groupName, string _groupDesc);

    function createGroup(string memory _groupName, string memory _groupDesc)
        public
    {
        // _name, _desc가 비어있으면 안됨.
        require(
            keccak256(bytes(_groupName)) != empty &&
                keccak256(bytes(_groupDesc)) != empty,
            "PODO: Please input group name, desc."
        );
        // 그룹 생성
        groupInfo[msg.sender].groupName = _groupName;
        groupInfo[msg.sender].groupDesc = _groupDesc;
        // 프론트 이벤트
        emit CreatedGroup(_groupName, _groupDesc);
    }

    /**
        모금활동을 등록

        **조건
        _title, _desc 는 비어있으면 안됨
        _targetmoney는 0보다 커야함
     */
    event CreatedProject(
        address _group,
        string _projectName,
        string _projectDesc,
        uint256 _targetMoney
    );

    function createProject(
        address _group,
        string memory _projectName,
        string memory _projectDesc,
        uint256 _targetMoney
    ) public {
        require(
            keccak256(bytes(_projectName)) != empty &&
                keccak256(bytes(_projectDesc)) != empty &&
                _targetMoney >= 0,
            "PODO: Please input group name, desc, targetmony."
        );
        // 현재 블럭
        uint256 startBlock = block.number;
        // 종료 블럭
        uint256 endBlock = startBlock.add(fundPeriod());
        // 프로젝트에 데이터를 삽입
        ProjectInfo storage project = projectInfo[_group];
        project.projectName = _projectName;
        project.projectDesc = _projectDesc;
        project.targetMoney = _targetMoney;
        project.currentMoney = 0;
        project.startBlock = startBlock;
        project.endBlock = endBlock;
        // 프론트 이벤트
        emit CreatedProject(_group, _projectName, _projectDesc, _targetMoney);
    }

    /**
            후원자들이 프로젝트에 기부

            **조건
            존재하는 프로젝트인지 확인
            프로젝트가 존재해야함
            기부 금액이 0보다 커야함
            기부자가 가지고있는 포도보다 큰지 확인
         */
    event DonatedToProject(address _group, uint256 _amount);

    function donateToProject(address _group, uint256 _amount) public {
        // 존재하는 프로젝트인지 확인
        require(hasProject(_group), "PODO: Not found project.");
        // 모금이 끝난 프로젝트인지 확인
        require(fundRaiseState(_group), "PODO: It's not a fundraising period.");
        // 기부 금액이 0보다 커야함
        require(_amount > 0, "PODO: The donation amount cannot be zero.");
        // 기부자가 가지고있는 포도보다 큰지 확인
        require(
            _amount < podo.balanceOf(msg.sender),
            "PODO: It's bigger than the amount you have."
        );
        // 기부의 금액 모금활동으로 받습니다.
        podo.transferFrom(address(msg.sender), address(this), _amount);
        // 기부 받은 포도수 만큼 currentMoney에 추가시켜줌
        projectInfo[_group].currentMoney = projectInfo[_group].currentMoney.add(
            _amount
        );
        // 기부자에게 투포권을 분배함
        ballot.mint(_group, address(msg.sender), _amount);
        // 프론트 이벤트
        emit DonatedToProject(_group, _amount);
    }

    /**
        현재 모금의 상태

        ** 조건
        프로젝트가 존재하는지 확인
     */
    function fundRaiseState(address _group) public view returns (bool) {
        // 프로젝트가 존재하는지 확인
        require(hasProject(_group), "PODO: Not found project.");
        // 프로젝트 정보 인스턴스 생성
        ProjectInfo memory project = projectInfo[_group];
        // 프로젝트 모금 진행중
        if (block.number <= project.endBlock) {
            return true;
        }
        return false;
    }

    /**
        포도 출금

        **조건
        프로젝트가 가지고있는 포도보다 작아야함
     */
    function withdraw(address _group, uint256 _amount) public onlyOwner {
        // 프로젝트가 가지고있는 포도보다 작아야함
        require(
            projectInfo[_group].currentMoney >= _amount,
            "PODO: The requested amount is greater than the vault amount."
        );
        // 요청금액 만큼 현재잔액에서 빼줌
        projectInfo[_group].currentMoney -= _amount;

        // 기부의 금액을 그룹 컨트랙트에 전송
        podo.transfer(address(_group), _amount);
    }

    /**
        그룹의 존재 여부
     */
    function hasGroup(address _group) public view returns (bool) {
        if (keccak256(bytes(groupInfo[_group].groupName)) != empty) {
            return true;
        }
        return false;
    }

    /**
        프로젝트의 존재여부
     */
    function hasProject(address _group) public view returns (bool) {
        if (keccak256(bytes(projectInfo[_group].projectName)) != empty) {
            return true;
        }
        return false;
    }

    /**
        프로젝트 정보 반환
    */
    function viewProject(address _group)
        public
        view
        returns (ProjectInfo memory)
    {
        return projectInfo[_group];
    }
}
