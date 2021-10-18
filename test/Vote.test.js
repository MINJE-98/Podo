// const Podo = artifacts.require("./Podo.sol");
// const Ballot = artifacts.require("./Ballot.sol");
// const Group = artifacts.require("./Group.sol");
// const Campaign = artifacts.require("./Campaign.sol");
// const Governor = artifacts.require("./Governor.sol");
// const { expectRevert, time } = require('@openzeppelin/test-helpers');

// contract("Governor", ([dev, alice, bob, carol, minje]) => {
//     const one = '100000000000000000';
//     const ten = '1000000000000000000'
//     const approve = '1000000000000000000000000000000000000000'
//     let podo = null;
//     let ballot = null;
//     let campaign = null;
//     let governor = null;
//     const campaignId = 0;
//     const proposeId = 0;
//     /**
//      * alice : 그룹 관리자
//      * bob : 그룹 관리자
//      * carol : 기부자
//      * minje : 기부자
//      * dev : 개발자
//      * 1 PODO = 100000000000000000
//      */
//     before(async () => {
//         // 개발자가 컨트랙트 배포
//         podo = await Podo.deployed({from: dev});
//         ballot = await Ballot.deployed({from: dev});
//         group = await Group.deployed({from: dev})
//         campaign = await Campaign.deployed(podo.address, ballot.address, group.address, {from: dev});
//         governor = await Governor.deployed(podo.address, ballot.address, group.address, campaign.address, {from: dev});
//         // 각 유저에게 테스트를 위한 포도 배포
//         await podo.mint(carol, ten, {from: dev});
//         await podo.mint(minje, ten, {from: dev});
//         // 각 유저별로 campaign approve
//         await podo.approve(campaign.address, approve, {from: alice});
//         await ballot.approve(campaign.address, approve, {from: alice});
//         await podo.approve(campaign.address, approve, {from: bob});
//         await ballot.approve(campaign.address, approve, {from: bob});
//         await podo.approve(campaign.address, approve, {from: carol});
//         await ballot.approve(campaign.address, approve, {from: carol});
//         await podo.approve(campaign.address, approve, {from: minje});
//         await ballot.approve(campaign.address, approve, {from: minje});
//         // podo, ballot 소유자를 campaign로 변경
//         await podo.transferOwnership(campaign.address, {from: dev});
//         await ballot.transferOwnership(campaign.address, {from: dev});
//         await campaign.transferOwnership(governor.address, {from: dev});
//         // 테스트를 위해 투표 딜레이 짧게 설정
//         await governor.setStartVoteDelay(10);
//         await governor.setEndVoteDelay(10);
//         await group.createGroupInfo("그룹", "생성", 0,{from: alice});
//         await campaign.createCampaign("캠페인1", "생성1", "10",0, 2,{from: alice});
//         await governor.creatPropose(0, '100',"propose 1", "desc 1", {from: alice});
//         await campaign.donateTocampaign(0, '100000000',{from: carol});
//         await campaign.donateTocampaign(0, '100000000',{from: minje});
//     });
//     /**
//      * 제안 생성
//      */
//     it('제안 생성!!!', async ()=>{
//         // alice가 모금된 금액에 대해 제안서를 작성합니다
//         await governor.creatPropose(0, '100',"propose 1", "desc 1", {from: alice});
//         // 등록된 제안 가져오기
//         const proposalResult = await governor.proposals(0, 0,{from: alice});
//         // 제안서 정보 확인
//         assert(proposalResult.proposalTitle === "propose 1");
//         assert(proposalResult.proposalDesc === "desc 1");
//         assert(proposalResult.proposeAmount.toString() === "100");
//     })
//     /**
//      *  투표하기
//      */
//     // 찬성 투표
//     it('0번 캠페인에 0번째 제안에 투표하기', async ()=> {
//         let nowBlock = await time.latestBlock()
//         nowBlock = +nowBlock.toString();
//         // 투표 기간 스킵
//         await time.advanceBlockTo(nowBlock + 10);

//         // 투표하기
//         await governor.castVote(
//             minje,
//             campaignId,
//             proposeId,
//             '100',
//             'good',
//             true,
//             {from: minje}
//         )
//         // 1. 투표자 정보 확인
//         const { voter, support, votes, reason } = await governor.voterInfo(campaignId, proposeId, 0);
//         assert(voter === minje);
//         assert(support === true);
//         assert(votes.toString() === '100');
//         assert(reason.toString() === 'good');
//         // 2. 제안 투표정보 확인
//         const { forVotes } = await governor.proposals(campaignId,proposeId);
//         assert(forVotes.toString() === '100');
//         // 3. 유저 투표권 수 확인
//         const voteAmount = await ballot.userInfo(campaignId);
//         assert(voteAmount.toString() === "99999900")
//         // 4. 유저 투표 여부 확인
//         const voted = await ballot.isVoted(campaignId,proposeId);
//         assert(voted === true);
//     })
//     // 반대 투표
//     it('', async ()=> {
//         // 새로운 제안 생성

//         await governor.castVote(
//             minje,
//             alice,
//             0,
//             '1000000000',
//             'bad proposal',
//             false
//         ,{from: minje});
//         // 등록된 제안 가져오기
//         const proposalResult = await governor.proposals(alice, 0);
//         // 제안에서 변경된 값 확인
//         assert(proposalResult.againstVotes.toString() === '1000000000');
//         // 제안에 투표한 minje의 정보
//         const voterInfo = await governor.voterInfo(alice, 0, 1);
//         // // 투표자 정보에서 변경된 값 확인
//         assert(voterInfo.voter === minje);
//         assert(voterInfo.hasVoted === true);
//         assert(voterInfo.votes.toString() === '1000000000');
//         assert(voterInfo.reason === 'bad proposal');
//         assert(voterInfo.support === false);
//         // minje의 기부 내역
//         const minjeVotes = await ballot.userInfo(alice, minje);
//         // 투표 여부 확인
//         assert(minjeVotes.hasVoted.toString() === '1000000000');
//         // minje의 투표권 갯수
//         const minjeBallotAmount = await ballot.balanceOf(minje);
//         // 투표권 제거된거 확인
//         assert(minjeBallotAmount.toString() === '99999999000000000')
//     })
    
//     /**
//      * 투표 종료 후
//      */
//     // 투표 승리
//     it('투표승리 후 출금 요청', async ()=>{
//         let nowBlock = await time.latestBlock()
//         nowBlock = +nowBlock.toString();
//         // 투표 기간 스킵
//         await time.advanceBlockTo(nowBlock + 10);
//         // 제안을 실행
//         await governor.executeProse(campaignId, proposeId, {from: alice});
//         // 제안 정보
//         const { executed } = await governor.proposals(campaignId,proposeId);
//         // 1. 실행이 상태값 확인
//         assert(executed === true);
//         // 2. 현재 모금된 금액 확인
//         const { currentMoney } = await campaign.campaignList(campaignId);
//         assert(currentMoney.toString() === "199999900")
//         // 3. 캠페인과 그룹의 포도 갯수 확인
//         const alicePodoAmount = await podo.balanceOf(alice);
//         assert(alicePodoAmount.toString() === '100')
//         const campaignPodoAmount = await podo.balanceOf(campaign.address);
//         assert(campaignPodoAmount.toString() === "199999900")
//     });

//     // // 투표 패배
//     // it('Defeat vote!', async ()=>{
//     //     let nowBlock = await time.latestBlock()
//     //     nowBlock = +nowBlock.toString();
//     //     // bob가 그룹을 생성합니다.
//     //     await campaign.createGroup("Mygroup", "desc....",{ from: bob});
//     //     // bob의 모금 프로젝트 생성
//     //     await campaign.createProject(bob, "bobDonate", "donatebob", ten,{from: bob});
//     //     // minje이 bob(그룹)에게 1포도를 후원
//     //     await campaign.donateToProject(bob, one, {from: minje});
//     //     // 모금 기간 스킵
//     //     await time.advanceBlockTo(nowBlock + 20);
//     //     // bob가 모금된 금액에 대해 제안서를 작성합니다
//     //     await governor.creatPropose(one,"propose 1", "desc 1", {from: bob});
//     //     // 10블럭 대기 스킵
//     //     await time.advanceBlockTo(nowBlock + 32);
//     //     await governor.castVote(
//     //         minje,
//     //         bob,
//     //         0,
//     //         '1000000000',
//     //         'bad proposal',
//     //         false]
//     //     ,{from: minje});
//     //     await time.advanceBlockTo(nowBlock + 36);
//     //     try {
//     //         // 제안을 실행
//     //         await governor.executeProse(0,{from: bob});
//     //     } catch (error) {
//     //         assert(error.reason == "PODO: The proposal doesn't successded.");
//     //     }
//     // })

//     /**
//      * 제안 취소
//      */
//     it('제안 취소', async ()=>{
//         await governor.creatPropose(0, '100',"propose 1", "desc 1", {from: alice});
//         await governor.cancelPropose(0, 1,{from: alice});
//         const propose = await governor.proposals(0, 1);
//         assert(propose.canceled === true);
//     })
// });
