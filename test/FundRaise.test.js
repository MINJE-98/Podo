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
     * 1 = 100000000000000000
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
        // fundRaise를 approve하기
        await podo.approve(fundRaise.address, '100000000000000000000000000000000000', {from: dev});
        await ballot.approve(fundRaise.address, '100000000000000000000000000000000000', {from: dev});
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
});
