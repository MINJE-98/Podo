const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const FundRaise = artifacts.require("./FundRaise.sol");
const Governor = artifacts.require("./Governor.sol");
const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require('console');

contract("Governor", ([dev, alice, bob, carol, minje]) => {
    const one = '100000000000000000';
    const ten = '1000000000000000000'
    const approve = '1000000000000000000000000000000000000000'
    let podo = null;
    let ballot = null;
    let fundRaise = null;
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
        governor = await Governor.deployed(podo.address, ballot.address, fundRaise.address, {from: dev});
        // 각 유저에게 테스트를 위한 포도 배포
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
        // podo, ballot 소유자를 fundRaise로 변경
        await podo.transferOwnership(fundRaise.address, {from: dev});
        await ballot.transferOwnership(fundRaise.address, {from: dev});
        await fundRaise.transferOwnership(governor.address, {from: dev});
        // 테스트를 위해 투표 딜레이 짧게 설정
        await governor.setStartVoteDelay(10);
        await governor.setEndVoteDelay(10);
    });
    /**
     * 제안 생성
     */
    it('Should created proposal', async ()=>{
        let nowBlock = await time.latestBlock()
        nowBlock = +nowBlock.toString();
        // alice가 그룹을 생성합니다.
        await fundRaise.createGroup("Mygroup", "desc....",{ from: alice});
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject(alice, "aliceDonate 1", "donateAlice 1", ten,{from: alice});
        // carol이 alice(그룹)에게 1포도를 후원
        await fundRaise.donateToProject(alice, one, {from: carol});
        // minje가 alice(그룹)에게 1포도를 후원
        await fundRaise.donateToProject(alice, one, {from: minje});
        // 모금 기간 스킵
        await time.advanceBlockTo(nowBlock + 12);
        // alice가 모금된 금액에 대해 제안서를 작성합니다
        await governor.creatPropose(one,"propose 1", "desc 1", {from: alice});
        // 등록된 제안 가져오기
        const proposalResult = await governor.proposals(alice, 0,{from: alice});
        // 제안서 정보 확인
        assert(proposalResult.proposalTitle === "propose 1");
        assert(proposalResult.proposalDesc === "desc 1");
    })
    /**
     * 제안에 투표하기
     */
    // 찬성 투표
    it('Forvote', async ()=> {
        let nowBlock = await time.latestBlock()
        nowBlock = +nowBlock.toString();
        await time.advanceBlockTo(nowBlock + 10);

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
        // 제안에서 변경된 값 확인
        assert(proposalResult.forVotes.toString() === '10000000000');
        // 제안에 투표한 carol의 정보
        const voterInfo = await governor.voterInfo(alice, 0, 0);
        // // 투표자 정보에서 변결된 값 확인
        assert(voterInfo.voter === carol);
        assert(voterInfo.hasVoted === true);
        assert(voterInfo.votes.toString() === '10000000000');
        assert(voterInfo.reason === 'good project');
        assert(voterInfo.support === true);
        // carol의 기부 내역
        const carolVotes = await ballot.userInfo(alice, carol);
        // 투표 여부 확인
        assert(carolVotes.hasVoted.toString() === '10000000000');
        // carol의 투표권 갯수
        const carolBallotAmount = await ballot.balanceOf(carol);
        // 투표권 제거된거 확인
        assert(carolBallotAmount.toString() === '99999990000000000')
    })
    // 반대 투표
    it('Againstvote', async ()=> {
        await governor.castVote(
            minje,
            alice,
            0,
            '1000000000',
            'bad proposal',
            false
        ,{from: minje});
        // 등록된 제안 가져오기
        const proposalResult = await governor.proposals(alice, 0);
        // 제안에서 변경된 값 확인
        assert(proposalResult.againstVotes.toString() === '1000000000');
        // 제안에 투표한 minje의 정보
        const voterInfo = await governor.voterInfo(alice, 0, 1);
        // // 투표자 정보에서 변경된 값 확인
        assert(voterInfo.voter === minje);
        assert(voterInfo.hasVoted === true);
        assert(voterInfo.votes.toString() === '1000000000');
        assert(voterInfo.reason === 'bad proposal');
        assert(voterInfo.support === false);
        // minje의 기부 내역
        const minjeVotes = await ballot.userInfo(alice, minje);
        // 투표 여부 확인
        assert(minjeVotes.hasVoted.toString() === '1000000000');
        // minje의 투표권 갯수
        const minjeBallotAmount = await ballot.balanceOf(minje);
        // 투표권 제거된거 확인
        assert(minjeBallotAmount.toString() === '99999999000000000')
    })
    
    /**
     * 투표 종료 후
     */
    // 투표 승리
    it('Win vote!', async ()=>{
        let nowBlock = await time.latestBlock()
        nowBlock = +nowBlock.toString();
        // 투표 기간 스킵
        await time.advanceBlockTo(nowBlock + 10);
        // 제안을 실행
        await governor.executeProse(0,{from: alice});
        // 제안 정보
        const propose = await governor.proposals(alice, 0);
        // 프로젝트 정보
        const project = await fundRaise.projectInfo(alice);
        // 그룹의 포도 수량 정보
        const groupPodoAmount = await podo.balanceOf(alice);
        //   현재 금고 잔액에서 출금 잔액을 뺌
        assert(project.currentMoney.toString() === propose.proposeAmount.toString());
         // 기부의 금액을 그룹 컨트랙트에 전송
        assert(groupPodoAmount.toString() === propose.proposeAmount.toString());
    });

    // 투표 패배
    it('Defeat vote!', async ()=>{
        let nowBlock = await time.latestBlock()
        nowBlock = +nowBlock.toString();
        // bob가 그룹을 생성합니다.
        await fundRaise.createGroup("Mygroup", "desc....",{ from: bob});
        // bob의 모금 프로젝트 생성
        await fundRaise.createProject(bob, "bobDonate", "donatebob", ten,{from: bob});
        // minje이 bob(그룹)에게 1포도를 후원
        await fundRaise.donateToProject(bob, one, {from: minje});
        // 모금 기간 스킵
        await time.advanceBlockTo(nowBlock + 20);
        // bob가 모금된 금액에 대해 제안서를 작성합니다
        await governor.creatPropose(one,"propose 1", "desc 1", {from: bob});
        // 10블럭 대기 스킵
        await time.advanceBlockTo(nowBlock + 32);
        await governor.castVote(
            minje,
            bob,
            0,
            '1000000000',
            'bad proposal',
            false
        ,{from: minje});
        await time.advanceBlockTo(nowBlock + 36);
        try {
            // 제안을 실행
            await governor.executeProse(0,{from: bob});
        } catch (error) {
            assert(error.reason == "PODO: The proposal doesn't successded.");
        }
    })

    /**
     * 제안 취소
     */
    it('Canceled propose', async ()=>{
        // 새로운 제안 생성
        await governor.creatPropose(1000, 'will cancel', 'alice', {from: alice});
        await governor.cancelPropose(alice, 1,{from: alice});
        const propose = await governor.proposals(alice, 1);
        assert(propose.canceled === true);
    })
});
