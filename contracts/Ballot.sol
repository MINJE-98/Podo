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
        uint256 amount;
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
    function setOwner() public onlyOwner {
        owner = msg.sender;
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
        // 이전 유저의 기부금액
        uint256 beforeAmount = user.amount;
        // 새로운 유저 기부금액 삽입
        user.amount = beforeAmount.add(_amount);
        // 투표권 생성
        _mint(_to, _amount);
        // TODO 프론트 이벤트 추가
    }

    /**
        유저의 투표 가능한 투표권
     */
    function getUserCurrentBallot(address _group, uint256 _pid)
        public
        view
        returns (UserInfo memory)
    {
        // 유저 인스턴스 생성
        UserInfo storage user = userInfo[_group][_pid][msg.sender];
        // 유저 정보 반환
        return user;
    }
}
