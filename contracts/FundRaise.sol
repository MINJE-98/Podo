// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract FundRaise {
    podoInterface public podo;
    Project public projects;

    struct Project {
        string title;
        string desc;
        uint256 targetmoney;
        uint256 currentmoney;
        uint256 state;
        address[] donator;
    }
    // 특정 지갑이 입금한 전체 이더를 저장
    mapping(address => uint256) totalBalance;
    // 특정 지갑이 입금한 이더에 PodoToken으로 Swap 가능한 개수
    mapping(address => uint256) payableBalance;

    // Podo 토큰의 메서드를 호출하기 위해 생성자에서 Podo 토큰 주소를 입력합니다.
    constructor(address _podo) {
        podo = podoInterface(_podo);
    }

    // 이더리움을 받는 메서드
    receive() external payable {
        // 이더리움을 입금 받고 받은 만큼 배열에 저장
        totalBalance[msg.sender] += msg.value;
        payableBalance[msg.sender] += msg.value;
    }

    // PodoToken으로 스왑합니다.
    function swapEtherToPodoToken(address _to, uint256 _amount) public {
        require(payableBalance[_to] >= 0);
        payableBalance[_to] -= _amount;
        podo.mint(_to, _amount);
    }
}

interface podoInterface {
    function mint(address _to, uint256 _amount) external;
}
