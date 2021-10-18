// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Group {
    // 그룹 정보
    struct GroupInfo {
        Category category;
        string name;
        string desc;
    }

    /**
        아동
        봉사
        기아
        기부
        등등...
     */
    enum Category {
        Children,
        Service,
        AbandonedChild,
        Donation
    }

    mapping(string => address) public groupName;
    mapping(Category => address[]) public groupCategory;
    mapping(address => GroupInfo) public groupInfo;
    address[] public groupList;

    // 그룹 리스트 반환
    function getGroupsList() public view returns (address[] memory) {
        return groupList;
    }

    // 그룹 개수 반환
    function getGroupLength() public view returns (uint256) {
        return groupList.length;
    }

    // 그룹 명으로 그룹 반환 -> 1:1
    function getGroupInfoFromGroupName(string memory _name)
        public
        view
        returns (GroupInfo memory)
    {
        address _group = groupName[_name];
        return groupInfo[_group];
    }

    // 카테고리별 그룹 주소 반환 -> 1:N
    function getGroupsAddressFromCategory(Category _category)
        public
        view
        returns (address[] memory)
    {
        address[] memory groups = groupCategory[_category];
        return groups;
    }

    // 그룹 주소로 그룹 반환 -> 1:1
    function getGroupInfoFromAddress(address _to)
        public
        view
        returns (GroupInfo memory)
    {
        return groupInfo[_to];
    }

    function createGroupInfo(
        string memory _name,
        string memory _desc,
        Category _category
    ) public {
        require(!hasGroup(msg.sender), "PODO: There's already a group");
        // 그룹 이름, 설명, 카테고리 작성
        groupInfo[msg.sender].name = _name;
        groupInfo[msg.sender].desc = _desc;
        groupInfo[msg.sender].category = _category;
        // 그룹 카테고리를 address에 매핑
        groupCategory[_category].push(msg.sender);
        // 그룹 명을 address에 매핑
        groupName[_name] = msg.sender;
        // 그룹 리스트에 그룹 주소 추가
        groupList.push(msg.sender);
    }

    function hasGroup(address _to) public view returns (bool) {
        if (keccak256(bytes(groupInfo[_to].name)) == keccak256("")) {
            return false;
        }
        return true;
    }
}
