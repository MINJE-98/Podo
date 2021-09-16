// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract FundRaise {
    // 특정 지갑이 입금한 전체 이더를 저장
    mapping(address => uint256) totalBalance;
    // 특정 지갑이 입금한 이더에 PodoToken으로 Swap 가능한 개수
    mapping(address => uint256) payableBalance;

    // 이더리움을 받는 메서드
    receive() external payable {
        // 이더리움을 입금 받고 받은 만큼 배열에 저장
        totalBalance[msg.sender] += msg.value;
        payableBalance[msg.sender] += msg.value;
    }
}
