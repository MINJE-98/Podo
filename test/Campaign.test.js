const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const Group = artifacts.require("./Group.sol");
const Campaign = artifacts.require("./Campaign.sol");

contract("Campaign", ([dev, alice, bob, carol]) => {
    const onePodo = '100000000000000000';
    const tenPodo = '1000000000000000000'
    const approvePodo = '1000000000000000000000000000000000000000'

    let podo = null;
    let ballot = null;
    let group = null;
    let campaign = null;
    /**
     * dev : 개발자
     * alice : 그룹 관리자
     * bob : 그룹 관리자
     * carol : 기부자
     * 1 PODO = 100000000000000000
     */
    before(async () => {
        // 개발자가 컨트랙트 배포
        podo = await Podo.deployed({from: dev});
        ballot = await Ballot.deployed({from: dev});
        group = await Group.deployed({from: dev})
        campaign = await Campaign.deployed(podo.address, ballot.address, group.address, {from: dev});
        // 각 유저에게 테스트를 위한 포도 배포
        await podo.mint(alice, tenPodo, {from: dev});
        await podo.mint(bob, tenPodo, {from: dev});
        await podo.mint(carol, tenPodo, {from: dev});
        // 각 유저별로 Campaign approve
        await podo.approve(campaign.address, approvePodo, {from: alice});
        await ballot.approve(campaign.address, approvePodo, {from: alice});
        await podo.approve(campaign.address, approvePodo, {from: bob});
        await ballot.approve(campaign.address, approvePodo, {from: bob});
        await podo.approve(campaign.address, approvePodo, {from: carol});
        await ballot.approve(campaign.address, approvePodo, {from: carol});
        // podo, ballot 소유자를 campaign 변경
        await podo.transferOwnership(campaign.address, {from: dev});
        await ballot.transferOwnership(campaign.address, {from: dev});
        // 그룹 생성
        await group.createGroupInfo("그룹", "생성", 0,{from: alice});
        await group.createGroupInfo("그룹", "생성", 0,{from: bob});
        // 캠페인 생성
        await campaign.createCampaign("캠페인1", "생성1", "1000000000",0, 10,{from: alice});
        await campaign.createCampaign("캠페인", "생성", "1000000000",10, 100,{from: bob});
        await campaign.createCampaign("캠페인2", "생성2", "1000000000",0, 1000,{from: alice});
    });
    it('캠페인아이디 0에 기부하기!', async ()=>{
        const campaignId = 0
        await campaign.donateTocampaign(campaignId, '100000000',{from: carol});
        // 1. 포도 갯수 확인
        const podoAmount = await podo.balanceOf(campaign.address);
        assert(podoAmount.toString() === '100000000');
        // 2. 캠페인에 기부한 유저 정보
        const campaignUserInfo = await campaign.userInfo(campaignId, 0)
        assert(campaignUserInfo.user === carol);
        assert(campaignUserInfo.donateAmount.toString() === '100000000');
        // 3. 캠페인에 현재 기부금액 업데이트
        const { currentMoney } = await campaign.campaignList(campaignId)
        assert(currentMoney.toString() === '100000000');
        // 4. 투표권에 기부한 유저 투표권 발급
        const count = await ballot.campaignLength({from: carol});
        console.log(`${carol}이 기부한 프로젝트 수:`, count.toString());
        const { voteAmount } = await ballot.userInfo(campaignId);
        assert(voteAmount.toString() === '100000000');
    })
    it('모든 캠페인 검색', async ()=> {
        const campaignList = 
            [["캠페인1", "생성1", "1000000000"],
                ["캠페인", "생성", "1000000000"],["캠페인2", "생성2", "1000000000"]];
        const campaignCount = await campaign.getCampaignLength();
        for (let i = 0; i < campaignCount; i++) {
            const { campaignName, campaignDesc, targetMoney } = await campaign.campaignList(i)
            
            assert(campaignName === campaignList[i][0]);
            assert(campaignDesc === campaignList[i][1]);
            assert(targetMoney.toString() === campaignList[i][2]);
        }
    })
    it('특정 캠페인 검색', async ()=>{
        const { campaignName, campaignDesc, targetMoney } = await campaign.getCampaignInfo(0);
        assert(campaignName === "캠페인1");
        assert(campaignDesc === "생성1");
        assert(targetMoney.toString() === "1000000000");
    });
    it('그룹별 캠페인 모두 검색', async ()=> {
        // 그룹이 가지고있는 캠페인 수
        const campaignLength = await campaign.getGroupCampaignLength(alice);
        console.log(`${alice}의 캠페인 개수:`,campaignLength.toString());
        // 비교를 위한 배열 생성
        const campaignList = [["캠페인1", "생성1", "1000000000",0, 10],["캠페인2", "생성2", "1000000000"]];
        // 그룹의 캠페인 아이디 획득 후 캠페인 정보 반환
        for(let  i = 0; i < campaignLength; i++) {
            const campaignId = await campaign.campaignId(alice, i);
            const {campaignName, campaignDesc, targetMoney} = await campaign.campaignList(campaignId);
            assert(campaignName === campaignList[i][0])
            assert(campaignDesc === campaignList[i][1])
            assert(targetMoney.toString() === campaignList[i][2])
        }
    });
    it('0번 캠페인에 기부한 유저 수', async ()=>{
        const userCount = await campaign.getCampaignUsersLength(0);
        assert(userCount.toString() === "1");
    })
    it('캠페인 권한 확인',async ()=>{
        const result = await campaign.onlyCampaignOwner(0,{from: carol});
        assert(result === false)
    })
});
