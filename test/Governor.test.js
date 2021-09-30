const Podo = artifacts.require("./Podo.sol");
const Ballot = artifacts.require("./Ballot.sol");
const FundRaise = artifacts.require("./FundRaise.sol");
const Timelock = artifacts.require("./TimeLock.sol");
const Governor = artifacts.require("./Governor.sol");

contract("Governor", ([alice, bob, carol, dev]) => {
    let podo = null;
    let ballot = null;
    let fundRaise = null;
    let timeLock = null;
    let governor = null;
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
        timeLock = await Timelock.deployed({from: dev});
        governor = await Governor.deployed(podo.address, ballot.address, fundRaise.address, timeLock.address, {from: dev});
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
     * 제안 생성
     * 
     * 제안 생성은 FundRaise가 끝이나야 가능함.
     */
    it('Should created proposal', async ()=>{
        // alice가 그룹을 생성합니다.
        await fundRaise.createGroup("Mygroup", "desc....",{ from: alice});
        // alice의 모금 프로젝트 생성
        await fundRaise.createProject("aliceDonate 1", "donateAlice 1", 10000, 0, 10);
        // alice가 모금된 금액에 대해 제안서를 작성합니다
        await governor.propose(0, "propose 1", "desc 1");
        // 등록된 제안 가져오기
        const result = await governor.proposals(alice, 0);
        // 테스트 시작
        assert(result[0].toString() === "propose 1");
        assert(result[1].toString() === "desc 1");
    })
    /**
     * 제안에 투표하기
     *         address _voter,
        address _group,
        uint256 _pid,
        uint256 _amount,
        string memory reason,
        bool support
     */
    it('Should vote to proposal', async ()=> {
        await governor.castVote();
    })
});
