const Group = artifacts.require("./Group.sol");

contract("Group", ([dev, alice, bob, carol]) => {
    let group = null;

    before(async () => {
        group = await Group.deployed({from: dev});
        await group.createGroupInfo("그룹", "생성", 0,{from: alice});
        await group.createGroupInfo("그룹", "생성", 0,{from: bob});
        await group.createGroupInfo("그룹", "생성", 1,{from: dev});
        await group.createGroupInfo("그룹", "생성", 1,{from: carol});
    });
    it('그룹이 잘 생성되었는지', async ()=>{
        const {name, desc} = await group.getGroupInfoFromAddress(alice)
        assert(name === "그룹");
        assert(desc === "생성");
    })
    it('이미 그룹이 있으면 그룹 생성 불가', async ()=>{
        try {
            await group.createGroupInfo("안녕", "디지몬", 0,{from: alice});
        } catch (error) {
            assert(error.reason === `PODO: There's already a group`);
        }
    })
    it('이름으로 그룹 검색', async ()=>{
        const {name, desc} = await group.getGroupInfoFromGroupName("그룹");
        assert(name === "그룹");
        assert(desc === "생성");
    })
    it('카테고리로 그룹 검색',async ()=>{
        const childrenGroup = await group.getGroupsAddressFromCategory(0);
        const serviceGroup = await group.getGroupsAddressFromCategory(1);
        const childrenGroupList = [alice, bob];
        const serviceGroupList = [dev, carol];
        // 카테고리 Children 그룹
        childrenGroup.forEach((v,idx) => {
            assert(v === childrenGroupList[idx])
        });
        // 카테고리 Service 그룹
        serviceGroup.forEach((v,idx) => {
            assert(v === serviceGroupList[idx])
        });
    })

});
