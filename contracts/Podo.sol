// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/Ownable.sol";

contract Podo is ERC20("PodoToken", "PODO") {
    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
