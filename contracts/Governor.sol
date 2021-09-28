// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/IERC20.sol";

contract Governor {
    bytes32 public empty = keccak256(bytes(""));
    IERC20 public podo;
    IERC20 public ballot;
    FunRaiseInterface public fundRaise;

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

    //  컨태랙트 주입
    constructor(
        IERC20 _podo,
        IERC20 _ballot,
        address _fundRaise
    ) {
        podo = _podo;
        ballot = _ballot;
        fundRaise = FunRaiseInterface(_fundRaise);
    }

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

interface FunRaiseInterface {
    function hasGorup() external;
}
