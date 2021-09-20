// SPDX-License-Identifier: MIT

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/IERC20.sol";

pragma solidity ^0.8.0;

contract FundRaise {
    using SafeMath for uint256;
    IERC20 public podo;

    // 유저정보
    struct UserInfo {
        uint256 amount;
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

    // podoInterface public podo;
    ProjectInfo[] public projectInfo;
    BallotInterface public ballot;

    // Project[_pid][address]
    // 프로젝트 pid에 해당하는 유저 어드래스.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    receive() external payable {}

    constructor(IERC20 _podo, address _ballot) {
        // 포도 컨트랙트 주입
        podo = _podo;
        // 투표 컨트랙트 주입
        ballot = BallotInterface(_ballot);
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
        uint256 _targetmoney,
        uint256 _startBlock,
        uint256 _endBlock
    ) public {
        string memory empty = "";
        require(
            keccak256(bytes(_title)) != keccak256(bytes(empty)) &&
                keccak256(bytes(_desc)) != keccak256(bytes(empty)) &&
                _targetmoney >= 0
        );
        // 현재 블럭
        uint256 startBlock = block.number;
        // 시작 시간을 정합니다.
        uint256 start = startBlock.add(_startBlock);
        // 끝나는 시간을 정합니다.
        uint256 end = start.add(_endBlock);
        // 프로젝트에 데이터를 삽입
        projectInfo.push(
            ProjectInfo({
                title: _title,
                desc: _desc,
                targetMoney: _targetmoney,
                currentMoney: 0,
                startBlock: start,
                endBlock: end
            })
        );
    }

    /**
        후원자들이 프로젝트에 기부

        **조건
        프로젝트가 존재해야함
        기부 금액이 0보다 커야함
     */

    function donateToProject(uint256 _pid, uint256 _amount) public {
        // project[pid]에 해당하는 호출자 주소 정보를 가져옵니다.
        UserInfo storage user = userInfo[_pid][msg.sender];
        // 사용가능한 프로젝트인지 확인
        require(projectInfo.length - 1 >= _pid);
        // 기부 금액이 0보다 커야함
        require(_amount > 0);
        // 사용자 정보에 입금한 금액을 추가
        uint256 beforeAmount = user.amount;
        user.amount = beforeAmount.add(_amount);
        // 기부의 금액을 모금 컨트랙트에 전송
        podo.transferFrom(address(msg.sender), address(this), _amount);
        // 기부자에게 투포권을 분배함
        ballot.mint(address(msg.sender), _amount);
    }

    /**
        총 프로젝트 수
     */
    function projectCount() public view returns (uint256) {}
}

interface BallotInterface {
    function mint(address _to, uint256 _amount) external;
}
