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
}
