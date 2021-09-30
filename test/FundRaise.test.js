const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const FundRaise = artifacts.require("./FundRaise.sol");

contract("FundRaise", ([alice, bob, carol, dev]) => {
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
        await podo.mint(alice, '10000000000000000000', {from: dev});
        await podo.mint(bob, '10000000000000000000', {from: dev});
        await podo.mint(carol, '10000000000000000000', {from: dev});
        // 각 유저별로 fundRaise approve
        await podo.approve(fundRaise.address, '100000000000000000000000000000000000', {from: alice});
        await ballot.approve(fundRaise.address, '100000000000000000000000000000000000', {from: alice});
        await podo.approve(fundRaise.address, '100000000000000000000000000000000000', {from: bob});
        await ballot.approve(fundRaise.address, '100000000000000000000000000000000000', {from: bob});
        await podo.approve(fundRaise.address, '100000000000000000000000000000000000', {from: carol});
        await ballot.approve(fundRaise.address, '100000000000000000000000000000000000', {from: carol});
    });

    /**
     * 그룹 생성
     */
    // alice의 주소로 팀이 제대로 생성되는지?
    it('should created A group of alice', async ()=> {
        // alice가 그룹을 생성합니다.
        await fundRaise.createGroup("alice", "i'm alice",{ from: alice});
        // 생성한 그룹 변수에 저장
        const result = await fundRaise.groupInfo(alice);
        // 테스트 시작
        assert(result.name === "alice");
        assert(result.desc === "i'm alice");
    })
    // 서로가 생성한 그룹이 매핑 되어있는지?
    it('Should created each groups', async ()=> {
        // alice와 bob이 자신의 그룹을 생성합니다.
        await fundRaise.createGroup("alice", "i'm alice",{ from: alice});
        await fundRaise.createGroup("bob", "i'm bob",{ from: bob});
        // 생성한 그룹 변수에 저장
        const aliceResult = await fundRaise.groupInfo(alice);
        const bobResult = await fundRaise.groupInfo(bob);
        // 테스트 시작
        assert(aliceResult.name === "alice");
        assert(aliceResult.desc === "i'm alice");
        assert(bobResult.name === "bob");
        assert(bobResult.desc === "i'm bob");
    })

    /**
     * 그룹의 프로젝트 생성
     */
    // 한개의 프로젝트 생성
    it('Should create a new project', async ()=> {
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject("aliceDonate 1", "donateAlice 1", 10000, 0, 10);
        // 생성한 프로젝트 변수에 저장
        const result = await fundRaise.viewGroupProjectInfo(alice, 0);
        // 테스트 시작
        assert(result.title === "aliceDonate 1");
        assert(result.desc === "donateAlice 1");
        assert(result.targetMoney === "10000");
    })
    // 여러개의 프로젝트 생성
    it('Should create a new projects', async ()=> {
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject("aliceDonate 2", "donateAlice 2", 2000000, 0, 10);
        // 생성한 프로젝트 변수에 저장
        const result = await fundRaise.viewGroupProjectsInfo(alice);
        // 테스트 시작
        assert(result[0].title === "aliceDonate 1");
        assert(result[0].desc === "donateAlice 1");
        assert(result[0].targetMoney === "10000");
        assert(result[1].title === "aliceDonate 2");
        assert(result[1].desc === "donateAlice 2");
        assert(result[1].targetMoney === "2000000");
    })

    /**
     * 프로젝트에 기부
     */
    it('Should Donate to Project', async ()=>{
        const onePodo = '100000000000000000';
        // carol이 0번째 프로젝트에 1개의 포토를 기부함
        await fundRaise.donateToProject(alice, 0, onePodo, {from: carol});
        // funRaise 내에서 확인
        const resultProject = await fundRaise.viewGroupProjectsInfo(alice);
        assert(resultProject[0].currentMoney === onePodo);
        // ballot 내에서 확인
        const resultBallot = await ballot.userInfo(alice, 0, carol);
        assert(resultBallot.donateAmount.toString() === onePodo);
    });
    
});
