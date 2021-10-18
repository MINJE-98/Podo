// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/Ownable.sol";
import "./Podo.sol";
import "./Campaign.sol";

contract Governor is Ownable {
    using SafeMath for uint256;
    bytes32 public empty = keccak256(bytes(""));
    uint256 votingStart = 0;
    uint256 votingEnd = 27700;

    Podo public podo;
    Group public group;
    Campaign public campaign;
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
    // 캠페인에는 여러개의 제안을 쓸 수 있다.
    // 캠페인에 접속해야 볼 수 있게
    // 캠페인 아이디 -> 제안 배열
    mapping(uint256 => Proposal[]) public proposals;
    // 제안에는 여러명의 투표자들이 포함되어있다.
    // 캠페인 아이디 -> 제안 아이디 -> 유저 정보
    mapping(uint256 => mapping(uint256 => VoterInfo[])) public voterInfo;

    //  컨트랙트 주입
    constructor(
        Podo _podo,
        Group _group,
        Campaign _campaign
    ) {
        podo = _podo;
        group = _group;
        campaign = _campaign;
    }

    // 제안서 내용 반환
    function getProposalInfo(uint256 _proposalId, uint256 _campaignId)
        public
        view
        returns (Proposal memory)
    {
        return proposals[_campaignId][_proposalId];
    }

    // 캠페인에 제안의 개수
    function getProposalLength(uint256 _campaignId)
        public
        view
        returns (uint256)
    {
        return proposals[_campaignId].length;
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

    function createPropose(
        uint256 _campaignId,
        uint256 _proposeAmount,
        string memory _title,
        string memory _desc
    ) public {
        // 그룹을 가지고있는지 확인
        require(group.hasGroup(msg.sender));
        // _campaignId에 해당하는 프로젝트가 존재해야함.
        require(campaign.hasCampaign(_campaignId), "PODO: Not found project.");
        // 프로젝트 권한 확인
        require(
            campaign.onlyCampaignOwner(msg.sender, _campaignId),
            "PODO: Not permission!!!"
        );
        //  _title, _desc는 비어있으면 안됨
        require(
            keccak256(bytes(_title)) != empty &&
                keccak256(bytes(_desc)) != empty,
            "PODO: Please input group name, desc."
        );
        // 모금이 끝난 프로젝트인지 확인
        require(
            !campaign.campaignState(_campaignId),
            "PODO: Project is active."
        );
        // 프로젝트가 가지고있는 포도보다 작아야함
        require(
            campaign.getCampaignInfo(_campaignId).currentMoney >=
                _proposeAmount,
            "PODO: The requested amount is greater than the vault amount."
        );
        // 현재 블럭
        uint256 startBlock = block.number.add(votingStart);
        // 종료 블럭
        uint256 endBlock = startBlock.add(votingEnd);
        // 제안 추가
        proposals[_campaignId].push(
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
    function executeProse(uint256 _proposeId, uint256 _campaignId) public {
        //  제안이 성공해야 제안 실행가능
        require(
            proposalState(_campaignId, _proposeId) == ProposalState.Succeeded,
            "PODO: The proposal doesn't successded."
        );
        // 프로젝트 권한 확인
        require(
            campaign.onlyCampaignOwner(msg.sender, _campaignId),
            "PODO: Not permission!!!"
        );
        // 제안은 한번 만 실행 가능
        require(
            !proposals[_campaignId][_proposeId].executed,
            "PODO: Already executed"
        );
        // 1. 제안을 true로 변경
        proposals[_campaignId][_proposeId].executed = true;
        // 2. 출금 메서드 호출
        campaign.withdraw(
            address(msg.sender),
            _campaignId,
            proposals[_campaignId][_proposeId].proposeAmount
        );
    }

    /**
        제안 취소
        **조건
        제안이 Pending상태일때 취소가 가능
    */
    event CancelPropose(uint256 _campaignId, uint256 _proposeId);

    function cancelPropose(uint256 _campaignId, uint256 _proposeId) public {
        // 프로젝트 권한 확인
        require(
            campaign.onlyCampaignOwner(msg.sender, _campaignId),
            "PODO: Not permission!!!"
        );
        // 제안이 Pending상태일때 취소 가능
        require(
            proposalState(_campaignId, _proposeId) == ProposalState.Pending,
            "PODO: The vote has already started can't canceled."
        );
        // 제안 취소 처리
        proposals[_campaignId][_proposeId].canceled = true;
        // 프론트 이벤트
        emit CancelPropose(_campaignId, _proposeId);
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
        uint256 _campaginId,
        uint256 _proposeId,
        uint256 _amount,
        string _reason,
        bool _support
    );

    function castVote(
        address _voter,
        uint256 _campaignId,
        uint256 _proposeId,
        uint256 _amount,
        string memory _reason,
        bool _support
    ) public {
        // 제안이 활성화 기간일때만 투표가 가능
        require(
            proposalState(_campaignId, _proposeId) == ProposalState.Active,
            "PODO: It's not a proposal period."
        );
        // 투표자 정보에 투표 정보 추가
        voterInfo[_campaignId][_proposeId].push(
            VoterInfo({
                voter: msg.sender,
                support: _support,
                votes: _amount,
                reason: _reason
            })
        );
        // 유저가 투표한 수 저장, 투표권수 제거
        campaign.burnBallot(_voter, _campaignId, _amount);
        // 제안에 투표한 투표권 추가
        if (_support) {
            proposals[_campaignId][_proposeId].forVotes += _amount;
        } else {
            proposals[_campaignId][_proposeId].againstVotes += _amount;
        }
        // 프론트 이벤트
        emit CastVote(
            _voter,
            _campaignId,
            _proposeId,
            _amount,
            _reason,
            _support
        );
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
    function proposalState(uint256 _campaginId, uint256 _proposeId)
        public
        view
        returns (ProposalState)
    {
        // 그룹 주소 -> 프로젝트 _projectID 인스턴스 생성
        Proposal storage proposal = proposals[_campaginId][_proposeId];
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
