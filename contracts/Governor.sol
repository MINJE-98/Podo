// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeMath.sol";

contract Governor {
    using SafeMath for uint256;
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

    modifier onlyGroupOwner() {
        // TODO 호출자가 그룹이 있는지 확인
        _;
    }

    /**
        제안 생성

        **조건
        _title, _desc는 비어있으면 안됨
        _pid에 해당하는 프로젝트가 존재해야함.
     */
    function propose(
        uint256 _pid,
        string memory _title,
        string memory _desc
    ) public {
        //  _title, _desc는 비어있으면 안됨
        require(
            keccak256(bytes(_title)) != empty &&
                keccak256(bytes(_desc)) != empty,
            "PODO: Please input group name, desc."
        );
        // TODO _pid에 해당하는 프로젝트가 존재해야함.
        // 현재 블럭
        uint256 startBlock = block.number;
        // 종료 블럭
        uint256 endBlock = startBlock.add(10000);
        //  newpropsal 인스턴스 생성
        Proposal memory newProposal = Proposal({
            title: _title,
            desc: _desc,
            forVotes: 0,
            againstVotes: 0,
            startBlock: startBlock,
            endBlock: endBlock,
            executed: false,
            canceled: false
        });
        // 호출자 그룹 -> project_pid에 새로운 제안을 추가
        proposal[msg.sender][_pid] = newProposal;
        // TODO 프론트 이벤트 추가
    }

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
    function viewGroupProjectInfo(address _group, uint256 _pid) external;
}
