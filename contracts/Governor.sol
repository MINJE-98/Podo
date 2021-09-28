// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Governor {
    // 제안 정보
    struct Proposal {
        string title;
        string desc;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startBlock;
        uint256 endBlock;
        bool executed;
        bool canceled;
    }
    // 제안 상태
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    // 그룹 주소 -> 프로젝트 pid -> 제안
    mapping(address => mapping(uint256 => Proposal)) proposal;

    /**
        제안 생성
     */
    function propose() public {}

    /**
        제안 상태 보기
     */
    function state() public {}

    /**
        통과
     */
    function execute() public {}

    /**
        부결
     */
    function cancel() public {}

    /**
        부결
     */
    function castVote() public {}
}
