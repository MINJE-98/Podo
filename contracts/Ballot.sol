// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/SafeMath.sol";

contract Ballot is ERC20("Ballot", "BALLOT") {
    using SafeMath for uint256;
    address public owner;
    // 유저정보
    struct UserInfo {
        uint256 donateAmount;
        uint256 hasVoted;
    }
    // 그룹 주소 -> 프로젝트 pid -> 유저 주소
    mapping(address => mapping(uint256 => mapping(address => UserInfo)))
        public userInfo;

    // 호출자의 주소 확인
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // 컨트랙트 주인 설정
    function setOwner(address _to) public onlyOwner {
        owner = _to;
    }

    // 투표권을 생성
    function mint(
        address _group,
        uint256 _pid,
        address _to,
        uint256 _amount
    ) external onlyOwner {
        // 유저 인스턴스 생성
        UserInfo storage user = userInfo[_group][_pid][_to];
        // 유저 기부 금액
        user.donateAmount = user.donateAmount.add(_amount);
        // 투표권 생성
        _mint(_to, _amount);
        // TODO 프론트 이벤트 추가
    }

    /**
        투표가능한 투표권수
     */
    function getUserCurrentBallot(address _group, uint256 _pid)
        public
        view
        returns (uint256)
    {
        // 유저가 투표한 투표권
        uint256 hasVoted = userInfo[_group][_pid][msg.sender].hasVoted;
        // TODO 프론트 이벤트 추가
        // 유저 정보 반환
        return hasVoted;
    }

    /**
        프로젝트에 투표를 함

        **조건
        유저의 투표권이 총 기부금액보다 작아야함.
     */
    function voteToProject(
        address _group,
        uint256 _pid,
        uint256 _amount
    ) public returns (uint256) {
        // 유저 정보 인스턴스 생성
        UserInfo storage user = userInfo[_group][_pid][msg.sender];
        // 이전 유저가 투표한 투표권수
        uint256 beforeHasVoted = user.hasVoted;
        // 현재 유저가 투표한 투표권수
        uint256 afterhasVoted = beforeHasVoted.add(_amount);
        // 유저의 투표권이 총 기부금액보다 작아야함.
        require(
            user.donateAmount < afterhasVoted,
            "PODO: Over the total number of votes."
        );
        // 유저의 총 투표수 갱신
        user.hasVoted = afterhasVoted;
        // 유저가 현재 투표한 투표수 반환
        return _amount;
    }
}
