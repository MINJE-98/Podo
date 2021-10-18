const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const Group = artifacts.require("./Group.sol");
const Campaign = artifacts.require("./Campaign.sol");
const Governor = artifacts.require("./Governor.sol");
const { expectRevert, time } = require('@openzeppelin/test-helpers');

contract("Proposal", ([dev, alice, bob, carol, minje]) => {
    const onePodo = '100000000000000000';
    const tenpPodoPodo = '1000000000000000000'
    const approvePodo = '1000000000000000000000000000000000000000'
    let podo = null;
    let ballot = null;
    let campaign = null;
    let governor = null;
    const campaignId = 0;
    const proposeId = 0;
    /**
     * alice : 그룹 관리자
     * bob : 그룹 관리자
     * carol : 기부자
     * minje : 기부자
     * dev : 개발자
     * 1 PODO = 100000000000000000
     */
    before(async () => {
        // 개발자가 컨트랙트 배포
        podo = await Podo.deployed({from: dev});
        ballot = await Ballot.deployed({from: dev});
        group = await Group.deployed({from: dev})
        campaign = await Campaign.deployed(podo.address, ballot.address, group.address, {from: dev});
        governor = await Governor.deployed(podo.address, ballot.address, group.address, campaign.address, {from: dev});
        // 각 유저에게 테스트를 위한 포도 배포
        await podo.mint(carol, tenpPodo, {from: dev});
        await podo.mint(minje, tenpPodo, {from: dev});
        // 각 유저별로 campaign approve
        await podo.approve(campaign.address, approvePodo, {from: alice});
        await ballot.approve(campaign.address, approvePodo, {from: alice});
        await podo.approve(campaign.address, approvePodo, {from: bob});
        await ballot.approve(campaign.address, approvePodo, {from: bob});
        await podo.approve(campaign.address, approvePodo, {from: carol});
        await ballot.approve(campaign.address, approvePodo, {from: carol});
        await podo.approve(campaign.address, approvePodo, {from: minje});
        await ballot.approve(campaign.address, approvePodo, {from: minje});
        // podo, ballot 소유자를 campaign로 변경
        await podo.transferOwnership(campaign.address, {from: dev});
        await ballot.transferOwnership(campaign.address, {from: dev});
        await campaign.transferOwnership(governor.address, {from: dev});
        // 테스트를 위해 투표 딜레이 짧게 설정
        await governor.setStartVoteDelay(10);
        await governor.setEnptenpPododVoteDelay(10);
        await group.createGroupInfo("그룹", "생성", 0,{from: alice});
        await campaign.createCampaign("캠페인1", "생성1", "10",0, 2,{from: alice});
        await campaign.donateTocampaign(0, '100000000',{from: carol});
        await campaign.donateTocampaign(0, '100000000',{from: minje});
        // alice가 모금된 금액에 대해 제안서를 작성합니다
        await governor.creatPropose(0, '100',"제안 1", "내용 2", {from: alice});
        // alice가 모금된 금액에 대해 제안서를 작성합니다
        await governor.creatPropose(0, '10000',"제안 2", "내용 2", {from: alice});
    });
    it('그룹의 제안 모두 검색', async ()=>{
        const proposalCount = await governor.
        getProposalLength();
        const proposalList = [["제안 1", "내용 2", '100'], ["제안 2", "내용 2", '10000']]
        for (let i = 0; i < proposalCount; i++) {
            const proposal = await governor.proposals(campaignId, i);
            assert(proposal.proposalTitle === proposalList[i][0]);
            assert(proposal.proposalDesc === proposalList[i][1]);
            assert(proposal.proposeAmount.toSring() === proposalList[i][2]);
        }
    })
    it('그룹의 특정 제안 내용', async ()=> {

    })
    it()
    it('제안 취소', async ()=>{
        await governor.creatPropose(0, '100',"propose 1", "desc 1", {from: alice});
        await governor.cancelPropose(0, 2,{from: alice});
        const propose = await governor.proposals(0, 2);
        assert(propose.canceled === true);
    })
});
