// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";

contract Podo is ERC20("PodoToken", "PODO") {
    string public groupName;

    address public owner = 0xB96882fa594888Ca8086000cAa5E6f6fa86aD7F9;

    modifier onlyOwner(address _to) {
        require(msg.sender == owner, "ERROR: your are not owner.");
        _;
    }

    /**
        그룹명 설정
     */
    constructor(string memory _groupName) {
        groupName = _groupName;
    }

    function setOwner(address _to) public onlyOwner(_to) {
        owner = _to;
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
