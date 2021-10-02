// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeMath.sol";

contract Governor {
    using SafeMath for uint256;

    bytes32 public empty = keccak256(bytes(""));
    IERC20 public podo;

    FunRaiseInterface public fundRaise;
    BallotsInterface public ballot;

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
        string proposalTitle;
        string proposalDesc;
        uint256 proposeAmount;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 voteStart;
        uint256 voteEnd;
        bool executed;
        bool canceled;
    }
    // 투표자 정보
    struct VoterInfo {
        address voter;
        bool hasVoted;
        bool support;
        uint256 votes;
        string reason;
    }
    // 제안 상태
    enum ProposalState {
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Executed
    }

    // 그룹 주소 -> 프로젝트 pid -> 제안
    mapping(address => mapping(uint256 => Proposal)) public proposals;

    // 투표자 매핑
    mapping(address => mapping(uint256 => VoterInfo[])) public voterInfo;

    //  컨태랙트 주입
    constructor(
        IERC20 _podo,
        address _ballot,
        address _fundRaise
    ) {
        podo = _podo;
        ballot = BallotsInterface(_ballot);
        fundRaise = FunRaiseInterface(_fundRaise);
    }

    modifier onlyGroupOwner() {
        require(fundRaise.hasGroup() == true, "PODO: Not found Group.");
        _;
    }

    /**
        제안 생성

        **조건
        _title, _desc는 비어있으면 안됨
        _projectID에 해당하는 프로젝트가 존재해야함.
        모금활동이 끝난 상태이여야 한다.
     */
    function creatPropose(
        uint256 _projectID,
        string memory _title,
        string memory _desc
    ) public onlyGroupOwner {
        // _projectID에 해당하는 프로젝트가 존재해야함.
        require(
            fundRaise.hasProject(address(msg.sender), _projectID) == true,
            "PODO: Not found project."
        );

        //  _title, _desc는 비어있으면 안됨
        require(
            keccak256(bytes(_title)) != empty &&
                keccak256(bytes(_desc)) != empty,
            "PODO: Please input group name, desc."
        );

        // 모금이 끝난 프로젝트인지 확인
        require(
            fundRaise.isProjectEnd(address(msg.sender), _projectID) == true,
            "PODO: Project is active."
        );

        // 현재 블럭
        uint256 startBlock = block.number;
        // 종료 블럭
        uint256 endBlock = startBlock.add(votingPeriod());

        //  newpropsal 인스턴스 생성
        Proposal storage newProposal = proposals[msg.sender][_projectID];
        // 새로운 제안 추가
        newProposal.proposalTitle = _title;
        newProposal.proposalDesc = _desc;
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
    function state(address _group, uint256 _projectID)
        public
        view
        returns (ProposalState)
    {
        // 그룹 주소 -> 프로젝트 _projectID 인스턴스 생성
        Proposal storage proposal = proposals[_group][_projectID];
        // 제안이 취소됨
        if (proposal.canceled) {
            return ProposalState.Canceled;
        }
        // 투표 시작
        else if (block.number <= proposal.voteEnd) {
            return ProposalState.Active;
        }
        // 투표 결과 (찬 <= 반 반대가 크거나 같을 경우 패배)
        else if (proposal.forVotes <= proposal.againstVotes) {
            return ProposalState.Defeated;
        }
        // 제안한 금액이 그룹에서 전달됨.
        else {
            return ProposalState.Executed;
        }
        // TODO 프론트 이벤트 추가
    }

    /**
        제안 실행

        **조건
        제안이 성공해야 제안 실행가능
     */
    function execute(uint256 _projectID) public onlyGroupOwner {
        //  제안이 성공해야 제안 실행가능
        require(
            state(address(msg.sender), _projectID) == ProposalState.Succeeded,
            "PODO: It's not a proposal period."
        );
        // 출금을 요청할 제안
        Proposal storage proposal = proposals[address(msg.sender)][_projectID];
        // 현재 요청한 금액을 출금 요청합니다.
    }

    /**
        제안 취소
     */
    function cancel() public {}

    /**
        투표
        
        **조건
        제안이 존재하지 않는 경우
        가지고 있는 투표수보다 많이 투표하는 경우
        투표권이 없는 경우
        투표가 진행중인 경우
     */
    function castVote(
        address _voter,
        address _group,
        uint256 _projectID,
        uint256 _amount,
        string memory reason,
        bool support
    ) public {
        // 투표할 제안 인스턴스 생성
        Proposal storage proposal = proposals[_group][_projectID];
        //  제안이 활성화 되어야 투표를 진행
        require(
            state(_group, _projectID) == ProposalState.Active,
            "PODO: It's not a proposal period."
        );
        // 투표자 리스트에 새로운 투표자의 투표 정보 추가
        voterInfo[_group][_projectID].push(
            VoterInfo({
                voter: _voter,
                hasVoted: true,
                reason: reason,
                support: support,
                votes: _amount
            })
        );

        // 이전 찬반 투표양
        uint256 beforeForVotes = proposal.forVotes;
        uint256 beforeAgainstVotes = proposal.againstVotes;
        // 제안에 투표한 투표권 추가
        if (support) {
            proposal.forVotes = beforeForVotes.add(_amount);
        } else {
            proposal.againstVotes = beforeAgainstVotes.add(_amount);
        }
        // ballot의 정보 수정
        ballot.voteToProject(_voter, _group, _projectID, _amount);
        // TODO 프론트 이벤트 추가
    }
}

interface FunRaiseInterface {
    // 모금 상태
    enum FundRaiseState {
        Pending,
        Active,
        Canceled,
        Ended,
        Queued
    }

    // 특정 프로젝트 정보 확인
    function viewOneProject(address _group, uint256 _projectID) external;

    // 모금활동 종료 여부
    function isProjectEnd(address _group, uint256 _projectID)
        external
        view
        returns (bool);

    // 그룹의 존재 여부
    function hasGroup() external view returns (bool);

    // 프로젝트의 존재 여부
    function hasProject(address _group, uint256 _projectID)
        external
        view
        returns (bool);
}

interface BallotsInterface {
    function voteToProject(
        address _voter,
        address _group,
        uint256 _projectID,
        uint256 _amount
    ) external;
}
