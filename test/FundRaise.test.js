const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const FundRaise = artifacts.require("./FundRaise.sol");

contract("FundRaise", ([alice, bob, carol, dev]) => {
    const one = '100000000000000000';
    const ten = '1000000000000000000'
    const approve = '1000000000000000000000000000000000000000'

    let podo = null;
    let ballot = null;
    let fundRaise = null;
    /**
     * alice : 그룹 관리자
     * bob : 그룹 관리자
     * carol : 기부자
     * dev : 개발자
     * 1 PODO = 100000000000000000
     */
    before(async () => {
        // 개발자가 컨트랙트 배포
        podo = await Podo.deployed({from: dev});
        ballot = await Ballot.deployed({from: dev});
        fundRaise = await FundRaise.deployed(podo.address, ballot.address, {from: dev});
        // 각 유저에게 테스트를 위한 포도 배포
        await podo.mint(alice, ten, {from: dev});
        await podo.mint(bob, ten, {from: dev});
        await podo.mint(carol, ten, {from: dev});
        // 각 유저별로 fundRaise approve
        await podo.approve(fundRaise.address, approve, {from: alice});
        await ballot.approve(fundRaise.address, approve, {from: alice});
        await podo.approve(fundRaise.address, approve, {from: bob});
        await ballot.approve(fundRaise.address, approve, {from: bob});
        await podo.approve(fundRaise.address, approve, {from: carol});
        await ballot.approve(fundRaise.address, approve, {from: carol});
    });

    /**
     * 그룹 생성
     */
    // 각 주소당 1개의 그룹이 생성되는지 확인
    it('Should created each groups', async ()=> {
        // alice 그룹 생성
        await fundRaise.createGroup("alice", "i'm alice",{ from: alice});
        // bob이 자신의 그룹을 생성합니다.
        await fundRaise.createGroup("bob", "i'm bob",{ from: bob});
        // 생성한 그룹 변수에 저장
        const aliceResult = await fundRaise.groupInfo(alice);
        console.log(aliceResult);
        const bobResult = await fundRaise.groupInfo(bob);
        /**
         * Start test
         * 각 주소당 1개의 그룹이 생성되는지 확인
         * 
         * 1. alice의 그룹 정보
         * 2. bob의 그룹 정보
         */
        // 1. alice의 그룹
        assert(aliceResult.groupName === "alice");
        assert(aliceResult.groupDesc === "i'm alice");
        // 2. bob의 그룹
        assert(bobResult.groupName === "bob");
        assert(bobResult.groupDesc === "i'm bob");
    })

    /**
     * 그룹의 프로젝트 생성
     */
    // 한개의 프로젝트 생성
    it('Should create a new project', async ()=> {
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject("aliceDonate 1", "donateAlice 1", 10000, 0, 100000);
        // 생성한 프로젝트 변수에 저장
        const result = await fundRaise.viewOneProject(alice, 0);
                /**
         * Start test
         * alice그룹이 두번째 새로운 프로젝트를 생성함.
         * 
         * 첫번째 프로젝트
         * 1. projectName -> alcieDonate 1
         * 2. projectDesc -> donateAlice 1
         * 3. targetMoney -> 10000
         * 새로운 프로젝트
         * 4. projectName -> alcieDonate 2
         * 5. projectDesc -> donateAlice 2
         * targetMoney -> 2000000
         */
        assert(result.projectName === "aliceDonate 1");
        assert(result.projectDesc === "donateAlice 1");
        assert(result.targetMoney === "10000");
    })
    // 여러개의 프로젝트 생성
    it('Should create a new projects', async ()=> {
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject("aliceDonate 2", "donateAlice 2", 2000000, 0, 0);
        // 생성한 프로젝트 변수에 저장
        const result = await fundRaise.viewTotalProjects(alice);
        /**
         * Start test
         * alice그룹이 두번째 새로운 프로젝트를 생성함.
         * 
         * 첫번째 프로젝트
         * 1. projectName -> alcieDonate 1
         * 2. projectDesc -> donateAlice 1
         * 3. targetMoney -> 10000
         * 새로운 프로젝트
         * 4. projectName -> alcieDonate 2
         * 5. projectDesc -> donateAlice 2
         * targetMoney -> 2000000
         */
        assert(result[0].projectName === "aliceDonate 1");
        assert(result[0].projectDesc === "donateAlice 1");
        assert(result[0].targetMoney === "10000");
        assert(result[1].projectName === "aliceDonate 2");
        assert(result[1].projectDesc === "donateAlice 2");
        assert(result[1].targetMoney === "2000000");
    })

    /**
     * 프로젝트에 기부
     */
    // 모금이 진행중인 프로젝트에 기부
    it('The project is active.', async ()=>{
        // carol이 0번째 프로젝트에 1개의 포토를 기부함
        await fundRaise.donateToProject(alice, 0, one, {from: carol});
        // alice의 모든 프로젝트 정보
        const resultProject = await fundRaise.viewTotalProjects(alice);
        // carol의 투표권 정보
        const resultBallot = await ballot.userInfo(alice, 0, carol);

        /**
         * Start test
         * alice그룹의 0번째 프로젝트에 carol이 1포도를 기부
         * 
         * 1. alice 그룹의 0번째 프로젝트에 1 포도가 있어야함.
         * 2. carol은 1포도와 동등한 비율의 투표권이 있어야함.
         */
        // 1. alice 그룹의 0번째 프로젝트에 1 포도가 있어야함.
        assert(resultProject[0].currentMoney === one);
        // 2. carol은 1포도와 동등한 비율의 투표권이 있어야함.
        assert(resultBallot.donateAmount.toString() === one);
    });

    // 모금이 끝이난 프로젝트에 기부
    it('The project is ended.', async ()=>{
        try {
            // carol이 1번째 프로젝트에 1개의 포토를 기부함
            await fundRaise.donateToProject(alice, 1, one, {from: carol});
        } catch (error) {
            assert(error.reason === "PODO: It's not a fundraising period.");
        }
    });
});
