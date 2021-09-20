// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";

contract BALLOT is ERC20("ballot", "BALLOT") {
    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
