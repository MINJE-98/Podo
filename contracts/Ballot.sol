// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";

contract BALLOT is ERC20("ballot", "BALLOT") {
    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/SafeMath.sol";

contract Vote is ERC20("Vote", "VOTE") {
    using SafeMath for uint256;
    // 유저정보
    struct UserInfo {
        uint256 amount;
    }
    // 그룹 주소 -> 프로젝트 pid -> 유저 주소
    mapping(address => mapping(uint256 => mapping(address => UserInfo)))
        public userInfo;

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }

    /**
        유저의 투표권을 저장
     */
    function setUserBallotAmount(
        address _group,
        uint256 _pid,
        uint256 _amount
    ) external {
        // 유저 인스턴스 생성
        UserInfo storage user = userInfo[_group][_pid][msg.sender];
        // 이전 유저의 기부금액
        uint256 beforeAmount = user.amount;
        // 새로운 유저 기부금액 삽입
        user.amount = beforeAmount.add(_amount);
        // TODO 프론트 이벤트 추가
    }
}
