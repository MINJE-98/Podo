// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeMath.sol";

contract Governor {
    using SafeMath for uint256;

    bytes32 public empty = keccak256(bytes(""));
    IERC20 public podo;

    FunRaiseInterface public fundRaise;
    TimelockInterface public timelock;
    BallotInterface public ballot;

    // 투표 딜레이
    function votingDelay() public pure returns (uint256) {
        return 1;
    } // 1 block

    // 투표 기간
    function votingPeriod() public pure returns (uint256) {
        return 17280;
    } // ~3 days in blocks (assuming 15s blocks)

    /**
        제안 WorkFlow
        제안 -> 투표 -> 성공 -> 큐 -> 트랜잭션
     */
    // 제안 정보
    struct Proposal {
        string title;
        string desc;
        // 제안이 성공 했을때 실행하는 타임스탬프
        uint256 eta;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 voteStart;
        uint256 voteEnd;
        bool executed;
        bool canceled;
        mapping(address => Receipt) receipts;
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
    // 투표 정보
    struct Receipt {
        // 해당 유저가 투표를 했는지?
        bool hasVoted;
        bool support;
        uint256 votes;
        string reason;
    }
    // 투표자 정보
    struct VoterInfo {
        address voter;
    }
    // 그룹 주소 -> 프로젝트 pid -> 제안
    mapping(address => mapping(uint256 => Proposal)) proposals;

    // 투표자 매핑
    mapping(address => mapping(uint256 => VoterInfo[])) voterInfo;

    //  컨태랙트 주입
    constructor(
        IERC20 _podo,
        address _ballot,
        address _fundRaise,
        address _timelock
    ) {
        podo = _podo;
        ballot = BallotInterface(_ballot);
        fundRaise = FunRaiseInterface(_fundRaise);
        timelock = TimelockInterface(_timelock);
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
        uint256 startBlock = block.number.add(votingDelay());
        // 종료 블럭
        uint256 endBlock = startBlock.add(votingPeriod());

        //  newpropsal 인스턴스 생성
        Proposal storage newProposal = proposals[msg.sender][_pid];
        // 새로운 제안 추가
        newProposal.title = _title;
        newProposal.desc = _desc;
        newProposal.eta = 0;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.voteStart = startBlock;
        newProposal.voteEnd = endBlock;
        newProposal.executed = false;
        newProposal.canceled = false;
        // TODO 프론트 이벤트 추가
    }

    /**
        제안 상태 보기
     */
    function state(address _group, uint256 _pid)
        public
        view
        returns (ProposalState)
    {
        // 그룹 주소 -> 프로젝트 _pid 인스턴스 생성
        Proposal storage proposal = proposals[_group][_pid];
        // 제안이 취소됨
        if (proposal.canceled) {
            return ProposalState.Canceled;
        }
        // 투표 시작전
        else if (block.number <= proposal.voteStart) {
            return ProposalState.Pending;
        }
        // 투표 시작
        else if (block.number <= proposal.voteEnd) {
            return ProposalState.Active;
        }
        // 투표 결과 (찬 <= 반 반대가 크거나 같을 경우 패배)
        else if (proposal.forVotes <= proposal.againstVotes) {
            return ProposalState.Defeated;
        }
        // 투표가 완료되고, 그룹이 제안한 금액 지급
        else if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        }
        // 투표 결과
        else if (proposal.executed) {
            return ProposalState.Executed;
        }
        // 조건 기간보다 현재 블럭이 크다면 기간 만료
        else if (block.timestamp >= proposal.eta.add(timelock.GRACE_PERIOD())) {
            return ProposalState.Expired;
        }
        // 큐에서 판단중
        else {
            return ProposalState.Queued;
        }
        // TODO 프론트 이벤트 추가
    }

    /**
        통과
     */
    function execute() public {}

    /**
        부결
     */
    function cancel() public {}

    /**
        투표
        
        **조건
        가지고 있는 투표수보다 많이 투표하는 경우
        투표권이 없는 경우

     */
    function castVote(
        address _voter,
        address _group,
        uint256 _pid,
        uint256 _amount,
        string memory reason,
        bool support
    ) public {
        // 투표할 제안 인스턴스 생성
        Proposal storage proposal = proposals[_group][_pid];
        // 투표자의 투표 정보 인스턴스 생성
        Receipt storage receipt = proposal.receipts[_voter];
        // 투표자 리스트에 새로운 투표자 추가
        voterInfo[_group][_pid].push(VoterInfo({voter: _voter}));
        // 투표자가 자의 투표권을 이용해 투표
        receipt.hasVoted = true;
        receipt.reason = reason;
        receipt.support = support;
        receipt.votes = _amount;
        // ballot의 정부 수정
        ballot.voteToProject(_group, _pid, _amount);
        // TODO 프론트 이벤트 추가
    }
}

interface TimelockInterface {
    function delay() external view returns (uint256);

    function GRACE_PERIOD() external view returns (uint256);

    function acceptAdmin() external;

    function queuedTransactions(bytes32 hash) external view returns (bool);

    function queueTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external returns (bytes32);

    function cancelTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external;

    function executeTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external payable returns (bytes memory);
}

interface FunRaiseInterface {
    function viewGroupProjectInfo(address _group, uint256 _pid) external;
}

interface BallotInterface {
    function voteToProject(
        address _group,
        uint256 _pid,
        uint256 _amount
    ) external returns (uint256);
}
