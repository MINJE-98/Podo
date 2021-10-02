const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const FundRaise = artifacts.require("./FundRaise.sol");
const Timelock = artifacts.require("./TimeLock.sol");
const Governor = artifacts.require("./Governor.sol");

contract("Governor", ([alice, bob, carol, minje, dev]) => {
    const one = '100000000000000000';
    const ten = '1000000000000000000'
    const approve = '1000000000000000000000000000000000000000'
    let podo = null;
    let ballot = null;
    let fundRaise = null;
    let timeLock = null;
    let governor = null;
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
        fundRaise = await FundRaise.deployed(podo.address, ballot.address, {from: dev});
        timeLock = await Timelock.deployed({from: dev});
        governor = await Governor.deployed(podo.address, ballot.address, fundRaise.address, timeLock.address, {from: dev});
        // 각 유저에게 테스트를 위한 포도 배포
        await podo.mint(alice, ten, {from: dev});
        await podo.mint(bob, ten, {from: dev});
        await podo.mint(carol, ten, {from: dev});
        await podo.mint(minje, ten, {from: dev});
        // 각 유저별로 fundRaise approve
        await podo.approve(fundRaise.address, approve, {from: alice});
        await ballot.approve(fundRaise.address, approve, {from: alice});
        await podo.approve(fundRaise.address, approve, {from: bob});
        await ballot.approve(fundRaise.address, approve, {from: bob});
        await podo.approve(fundRaise.address, approve, {from: carol});
        await ballot.approve(fundRaise.address, approve, {from: carol});
        await podo.approve(fundRaise.address, approve, {from: minje});
        await ballot.approve(fundRaise.address, approve, {from: minje});
    });
    /**
     * 제안 생성
     */
    it('Should created proposal', async ()=>{
        // alice가 그룹을 생성합니다.
        await fundRaise.createGroup("Mygroup", "desc....",{ from: alice});
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject("aliceDonate 1", "donateAlice 1", 10000, 0, 2,{from: alice});
        // carol이 alice(그룹)에게 1포도를 후원
        await fundRaise.donateToProject(alice, 0, one, {from: carol});
        // minje가 alice(그룹)에게 1포도를 후원
        await fundRaise.donateToProject(alice, 0, one, {from: minje});
        // alice가 모금된 금액에 대해 제안서를 작성합니다
        await governor.creatPropose(0, "propose 1", "desc 1", {from: alice});
        // 등록된 제안 가져오기
        const proposalResult = await governor.proposals(alice, 0);
        /**
         * Start test
         * alice그룹이 첫번째 프로젝트에 제안를 작성.
         * 
         * 1. 제안서 정보
         */

        // 1. 제안서 정보
        assert(proposalResult.proposalTitle === "propose 1");
        assert(proposalResult.proposalDesc === "desc 1");
    })
    /**
     * 제안에 투표하기
     */
    // 찬성 투표
    it('Forvote', async ()=> { 
        await governor.castVote(
            carol,
            alice,
            0,
            '10000000000',
            'good project',
            true
        ,{from: carol});
        // 등록된 제안 가져오기
        const proposalResult = await governor.proposals(alice, 0);
        console.log(proposalResult.voteEnd.toString());
        // 제안에 투표한 carol의 정보
        const voterInfo = await governor.voterInfo(alice, 0, 0);
        // carol의 기부 내역
        const carolVotes = await ballot.userInfo(alice, 0, carol);
        /**
         * Start test
         * 
         * 1. 투표자 리스트에 새로운 투표자의 투표 정보 추가
         * 2. 제안에 투표한 투표권 추가
         * 3. coral의 투표권 정보
         */
        // 1. 투표자 리스트에 새로운 투표자의 투표 정보 추가
        assert(voterInfo.hasVoted === true);
        assert(voterInfo.votes.toString() ===  '10000000000');
        assert(voterInfo.reason === 'good project');
        assert(voterInfo.support === true);
        // 2. 제안에 투표한 투표권 추가
        assert(proposalResult.forVotes.toString() === "10000000000");
        // 3. coral의 투표권 정보
        assert(carolVotes.hasVoted.toString() === "10000000000");
    })
    // 반대 투표
    it('Againstvote', async ()=> {
        await governor.castVote(
            minje,
            alice,
            0,
            '10000000000',
            'bad proposal',
            false
        ,{from: minje});
        // 등록된 제안 가져오기
        const proposalResult = await governor.proposals(alice, 0);
        // 제안에 투표한 minje의 정보
        const voterInfo = await governor.voterInfo(alice, 0, 1);
        // minje의 기부 내역
        const minjeVotes = await ballot.userInfo(alice, 0, minje);
        /**
         * Start test
         * 
         * 1. 투표자 리스트에 새로운 투표자의 투표 정보 추가
         * 2. 제안에 투표한 투표권 추가
         * 3. coral의 투표권 정보
         */
        // 1. 투표자 리스트에 새로운 투표자의 투표 정보 추가
        assert(voterInfo.hasVoted === true);
        assert(voterInfo.votes.toString() ===  '10000000000');
        assert(voterInfo.reason === 'bad proposal');
        assert(voterInfo.support === false);
        // 2. 제안에 투표한 투표권 추가
        assert(proposalResult.againstVotes.toString() === "10000000000");
        // 3. coral의 투표권 정보
        assert(minjeVotes.hasVoted.toString() === "10000000000");
    })
    
});
