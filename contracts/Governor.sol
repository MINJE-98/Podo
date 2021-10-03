// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/Ownable.sol";
import "./Podo.sol";
import "./Ballot.sol";
import "./FundRaise.sol";

contract Governor is Ownable {
    using SafeMath for uint256;

    bytes32 public empty = keccak256(bytes(""));
    uint256 votingStart = 0;
    uint256 votingEnd = 177200;

    Podo public podo;
    FundRaise public fundRaise;
    Ballot public ballot;

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
        Executed,
        Pending
    }
    // 그룹 주소 -> 제안
    mapping(address => Proposal[]) public proposals;
    // 그룹 주소 -> 투표자 매핑
    mapping(address => mapping(uint256 => VoterInfo[])) public voterInfo;

    //  컨태랙트 주입
    constructor(
        Podo _podo,
        Ballot _ballot,
        FundRaise _fundRaise
    ) {
        podo = _podo;
        ballot = _ballot;
        fundRaise = _fundRaise;
    }

    modifier onlyGroupOwner(address _group) {
        require(fundRaise.hasGroup(_group), "PODO: Not found Group.");
        _;
    }

    /**
        제안 생성

        **조건
        _title, _desc는 비어있으면 안됨
        _projectID에 해당하는 프로젝트가 존재해야함.
        모금활동이 끝난 상태이여야 한다.
        프로젝트에 모금된 금액보다 크면 안됨
    */
    event CreatedPropose(uint256 _proposeAmount, string _title, string _desc);

    function creatPropose(
        uint256 _proposeAmount,
        string memory _title,
        string memory _desc
    ) public onlyGroupOwner(msg.sender) {
        // _projectID에 해당하는 프로젝트가 존재해야함.
        require(fundRaise.hasProject(msg.sender), "PODO: Not found project.");
        //  _title, _desc는 비어있으면 안됨
        require(
            keccak256(bytes(_title)) != empty &&
                keccak256(bytes(_desc)) != empty,
            "PODO: Please input group name, desc."
        );
        // 모금이 끝난 프로젝트인지 확인
        require(
            !fundRaise.fundRaiseState(msg.sender),
            "PODO: Project is active."
        );
        // 프로젝트가 가지고있는 포도보다 작아야함
        require(
            fundRaise.viewProject(msg.sender).currentMoney >= _proposeAmount,
            "PODO: The requested amount is greater than the vault amount."
        );
        // 현재 블럭
        uint256 startBlock = block.number.add(votingStart);
        // 종료 블럭
        uint256 endBlock = startBlock.add(votingEnd);
        // 제안 추가
        proposals[msg.sender].push(
            Proposal({
                proposalTitle: _title,
                proposalDesc: _desc,
                proposeAmount: _proposeAmount,
                forVotes: 0,
                againstVotes: 0,
                voteStart: startBlock,
                voteEnd: endBlock,
                executed: false,
                canceled: false
            })
        );
        // 프론트 이벤트
        emit CreatedPropose(_proposeAmount, _title, _desc);
    }

    /**
        제안 실행
        **조건
        제안이 성공해야 제안 실행가능
    */
    function executeProse(uint256 _proposeId)
        public
        onlyGroupOwner(msg.sender)
    {
        //  제안이 성공해야 제안 실행가능
        require(
            state(address(msg.sender), _proposeId) == ProposalState.Succeeded,
            "PODO: The proposal doesn't successded."
        );
        proposals[address(msg.sender)][_proposeId].executed = true;
        // 현재 요청한 금액을 출금 요청합니다.
        fundRaise.withdraw(
            address(msg.sender),
            proposals[address(msg.sender)][_proposeId].proposeAmount
        );
    }

    /**
        제안 취소

        **조건 
        제안이 Pending상태일때 취소가 가능
    */
    event CancelPropose(address _group, uint256 _proposeId);

    function cancelPropose(address _group, uint256 _proposeId) public {
        // 제안이 Pending상태일때 취소 가능
        require(
            state(_group, _proposeId) == ProposalState.Pending,
            "PODO: The vote has already started can't canceled."
        );
        // 제안 취소 처리
        proposals[msg.sender][_proposeId].canceled = true;
        // 프론트 이벤트
        emit CancelPropose(_group, _proposeId);
    }

    /**
        투표
        **조건
        제안이 존재하지 않는 경우
        가지고 있는 투표수보다 많이 투표하는 경우
        투표권이 없는 경우
        투표가 진행중인 경우
    */
    event CastVote(
        address _voter,
        address _group,
        uint256 _proposeId,
        uint256 _amount,
        string _reason,
        bool _support
    );

    function castVote(
        address _voter,
        address _group,
        uint256 _proposeId,
        uint256 _amount,
        string memory _reason,
        bool _support
    ) public {
        // 제안이 활성화 기간일때만 투표가 가능
        require(
            state(_group, _proposeId) == ProposalState.Active,
            "PODO: It's not a proposal period."
        );
        // 제안에 투표한 투표권 추가
        if (_support) {
            proposals[_group][_proposeId].forVotes += _amount;
        } else {
            proposals[_group][_proposeId].againstVotes += _amount;
        }
        // 투표자 정보에 투표 정보 추가
        voterInfo[_group][_proposeId].push(
            VoterInfo({
                voter: msg.sender,
                hasVoted: true,
                support: _support,
                votes: _amount,
                reason: _reason
            })
        );
        // 유저가 투표한 수 저장, 투표권수 제거
        ballot.voteToProject(_voter, _group, _amount);
        // 프론트 이벤트
        emit CastVote(_voter, _group, _proposeId, _amount, _reason, _support);
    }

    // 투표 시작 딜레이 설정
    function setStartVoteDelay(uint256 _delay) public onlyOwner {
        votingStart = _delay;
    }

    // 투표 종료 딜레이 설정
    function setEndVoteDelay(uint256 _delay) public onlyOwner {
        votingEnd = _delay;
    }

    /**
        제안 상태 보기
    */
    function state(address _group, uint256 proposeId)
        public
        view
        returns (ProposalState)
    {
        // 그룹 주소 -> 프로젝트 _projectID 인스턴스 생성
        Proposal storage proposal = proposals[_group][proposeId];
        // 제안이 취소됨
        if (proposal.canceled) {
            return ProposalState.Canceled;
        }
        // 투표 대기
        else if (block.number <= proposal.voteStart) {
            return ProposalState.Pending;
        }
        // 투표 시작
        else if (block.number <= proposal.voteEnd) {
            return ProposalState.Active;
        }
        // 투표 패배
        else if (proposal.forVotes <= proposal.againstVotes) {
            return ProposalState.Defeated;
        }
        // 투표 승리
        else if (proposal.forVotes > proposal.againstVotes) {
            return ProposalState.Succeeded;
        }
        // 제안 실행
        else if (proposal.executed) {
            return ProposalState.Executed;
        } else {
            // 대기중
            return ProposalState.Pending;
        }
    }
}
