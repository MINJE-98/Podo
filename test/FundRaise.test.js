const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const FundRaise = artifacts.require("./FundRaise.sol");
const { expectRevert, time } = require('@openzeppelin/test-helpers');

contract("FundRaise", ([dev, alice, bob, carol]) => {
    const onePodo = '100000000000000000';
    const tenPodo = '1000000000000000000'
    const approvePodo = '1000000000000000000000000000000000000000'

    let podo = null;
    let ballot = null;
    let fundRaise = null;
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
        fundRaise = await FundRaise.deployed(podo.address, ballot.address, {from: dev});
        // 각 유저에게 테스트를 위한 포도 배포
        await podo.mint(alice, tenPodo, {from: dev});
        await podo.mint(bob, tenPodo, {from: dev});
        await podo.mint(carol, tenPodo, {from: dev});
        // 각 유저별로 fundRaise approve
        await podo.approve(fundRaise.address, approvePodo, {from: alice});
        await ballot.approve(fundRaise.address, approvePodo, {from: alice});
        await podo.approve(fundRaise.address, approvePodo, {from: bob});
        await ballot.approve(fundRaise.address, approvePodo, {from: bob});
        await podo.approve(fundRaise.address, approvePodo, {from: carol});
        await ballot.approve(fundRaise.address, approvePodo, {from: carol});
        // podo, ballot 소유자를 fundRaise로 변경
        await podo.transferOwnership(fundRaise.address, {from: dev});
        await ballot.transferOwnership(fundRaise.address, {from: dev});
    });
    /**
     * 그룹 생성
     */
    // 그룹이 생성이 생성 되어야합니다.
    it('Should created groups', async ()=> {
        // alice 그룹 생성
        await fundRaise.createGroup("alice", "i'm alice",{ from: alice});
        // bob이 그룹 생성
        await fundRaise.createGroup("bob", "i'm bob",{ from: bob});
        // 생성한 그룹 불러오기
        const aliceResult = await fundRaise.groupInfo(alice);
        // alice의 그룹 생성 확인
        assert(aliceResult.groupName === "alice");
        assert(aliceResult.groupDesc === "i'm alice");
        const bobResult = await fundRaise.groupInfo(bob);
        // bob의 그룹 생성 확인
        assert(bobResult.groupName === "bob");
        assert(bobResult.groupDesc === "i'm bob");
    })

    /**
     * 그룹의 프로젝트 생성
     */
    // 한개의 프로젝트 생성
    it('Should create a new project', async ()=> {
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject(alice, "aliceProjectTitle", "aliceProjectDesc", tenPodo, {from: alice});
        // 생성한 프로젝트 변수에 저장
        const aliceProject = await fundRaise.viewProject(alice, {from: alice});
        // alice의 모금 프로젝트 생성 확인
        assert(aliceProject.projectName === "aliceProjectTitle");
        assert(aliceProject.projectDesc === "aliceProjectDesc");
        assert(aliceProject.targetMoney === tenPodo);
        // bob 모금 프로젝트 생성
        await fundRaise.createProject(bob, "bobProjectTitle", "bobProjectDesc", tenPodo, {from: bob});
        // 생성한 프로젝트 변수에 저장
        const bobProject = await fundRaise.viewProject(bob, {from: bob});
        // alice의 모금 프로젝트 생성 확인
        assert(bobProject.projectName === "bobProjectTitle");
        assert(bobProject.projectDesc === "bobProjectDesc");
        assert(bobProject.targetMoney === tenPodo);
    })

    /**
     * 프로젝트에 기부
     */
    // 모금이 진행중인 프로젝트에 기부
    it('The project is active.', async ()=>{
        // carol이 0번째 프로젝트에 1개의 포토를 기부함
        await fundRaise.donateToProject(alice, onePodo, {from: carol});
        // 현재 모금활동으로 입금된 포도 갯수
        const podoAmount = await podo.balanceOf(fundRaise.address);
        // 기부받은 포도 확인
        assert(podoAmount.toString() === onePodo);
        // alice의 프로젝트 정보
        const aliceProject = await fundRaise.viewProject(alice);
        // 기부받은 포도 확인
        assert(aliceProject.currentMoney === onePodo);
        // carol의 투표권 정보
        const carolBallot = await ballot.userInfo(alice, carol);
        // 발급 받은 투표권 확인
        assert(carolBallot.donateAmount.toString() === onePodo);
    });
    // 가지고있는 포도 수보다 많이 기부
    it('It\'s bigger than the amount you have.', async ()=>{
        try {
            // carol이 1번째 프로젝트에 1개의 포토를 기부함
            await fundRaise.donateToProject(alice, approvePodo, {from: carol});
        } catch (error) {
            assert(error.reason === "PODO: It's bigger than the amount you have.");
        }
    });
    // 모금이 끝이난 프로젝트에 기부
    it('The project is ended.', async ()=>{
        let nowBlock = await time.latestBlock()
        nowBlock = +nowBlock.toString();
        // 투표 기간 스킵
        await time.advanceBlockTo(nowBlock + 15);
        try {
            // carol이 1번째 프로젝트에 1개의 포토를 기부함
            await fundRaise.donateToProject(alice, onePodo, {from: carol});
        } catch (error) {
            assert(error.reason === "PODO: It's not a fundraising period.");
        }
    });
});
