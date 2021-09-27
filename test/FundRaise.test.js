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
});
