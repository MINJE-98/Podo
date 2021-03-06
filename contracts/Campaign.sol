// SPDX-License-Identifier: MIT

import "./openzeppelin/SafeMath.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/IERC20.sol";
import "./Podo.sol";
import "./Group.sol";

pragma solidity ^0.8.0;

contract Campaign is Ownable {
    using SafeMath for uint256;

    Group public group;
    Podo public podo;
    bytes32 public empty = keccak256(bytes(""));

    // 캠페인
    struct CampaignInfo {
        address owner;
        string campaignName;
        string campaignDesc;
        uint256 targetMoney;
        uint256 currentMoney;
        uint256 startBlock;
        uint256 endBlock;
    }
    // 캠페인에 기부한 유저
    struct UserInfo {
        uint256 donateAmount;
        uint256 ballotAmount;
    }
    // 그룹 주소 => 캠페인 리스트
    mapping(address => uint256[]) public campaignId;
    // 캠페인 아이디 -> 유저 리스트
    mapping(uint256 => address[]) public userList;
    // 유저 주소 => 캠페인 아이디 => 유저 정보 리스트
    mapping(address => mapping(uint256 => UserInfo)) public userInfo;
    // 유저 주소 => 캠페인  리스트
    mapping(address => uint256[]) public userDonatedList;
    CampaignInfo[] public campaignList;

    // 유저가 기부한 캠페인 아이디 리스트
    function getCampaignDonateduser(address _to)
        public
        view
        returns (uint256[] memory)
    {
        return userDonatedList[_to];
    }

    // 전체 그룹 길이
    function getCampaignLength() public view returns (uint256) {
        return campaignList.length;
    }

    // 그룹의 캠페인 아이디 반환
    function getCampaignList(address _group)
        public
        view
        returns (uint256[] memory)
    {
        return campaignId[_group];
    }

    // 특정 캠페인 반환
    function getCampaignInfo(uint256 _campaignId)
        public
        view
        returns (CampaignInfo memory)
    {
        return campaignList[_campaignId];
    }

    // 캠페인에 기부한 유저 수
    function getCampaignUsersLength(uint256 _campaignId)
        public
        view
        returns (uint256)
    {
        return userList[_campaignId].length;
    }

    // 캠페인에 기부한 유저 리스트
    function getCampaignUserList(uint256 _campaignId)
        public
        view
        returns (address[] memory)
    {
        return userList[_campaignId];
    }

    // 캠페인에 기부한 특정 유저 정보
    function getCampaignUserInfo(uint256 _campaignId, address _user)
        public
        view
        returns (UserInfo memory)
    {
        return userInfo[_user][_campaignId];
    }

    //  그룹별 캠페인 개수
    function getGroupCampaignLength(address _group)
        public
        view
        returns (uint256)
    {
        return campaignId[_group].length;
    }

    // 캠페인 아이디
    constructor(Podo _podo, Group _group) {
        // 포도 컨트랙트 주입
        podo = _podo;
        // 그룹 컨트랙트 주입
        group = _group;
    }

    // 그룹을 가지고있는 사용자만 캠페인를 생성할 수 있습니다.
    // msg.sender가 제안을 가지고있는지 확인
    function onlyCampaignOwner(address _group, uint256 _campaignId)
        public
        view
        returns (bool)
    {
        uint256 count = campaignId[_group].length;
        bool isOwner = false;
        for (uint256 i = 0; i < count; i++) {
            uint256[] memory array = campaignId[_group];
            if (array[i] == _campaignId) {
                isOwner = true;
                break;
            }
        }
        return isOwner;
    }

    /**
        모금활동을 등록

        **조건
        _title, _desc 는 비어있으면 안됨
        _targetmoney는 0보다 커야함`
    */
    event CreatedCampaign(
        string _campaignName,
        string _campaignDesc,
        uint256 _targetMoney
    );

    function createCampaign(
        string memory _campaignName,
        string memory _campaignDesc,
        uint256 _targetMoney,
        uint256 startBlock,
        uint256 endBlock
    ) public {
        require(
            keccak256(bytes(_campaignName)) != empty &&
                keccak256(bytes(_campaignDesc)) != empty &&
                _targetMoney >= 0,
            "PODO: Please input group name, desc, targetmony."
        );
        require(group.hasGroup(msg.sender));
        // 현재 블럭
        uint256 startTime = block.number.add(startBlock);
        // 종료 블럭
        uint256 endTime = startTime.add(endBlock);
        // 입력받은 캠페인 인스턴스 생성
        CampaignInfo memory newCampaign = CampaignInfo({
            owner: msg.sender,
            campaignName: _campaignName,
            campaignDesc: _campaignDesc,
            targetMoney: _targetMoney,
            currentMoney: 0,
            startBlock: startTime,
            endBlock: endTime
        });
        // 새로운 캠페인 아이디 삽입
        campaignId[msg.sender].push(campaignList.length);
        // 배열에 새로운 캠페인를 삽입
        campaignList.push(newCampaign);
        // 프론트 이벤트
        emit CreatedCampaign(_campaignName, _campaignDesc, _targetMoney);
    }

    /**
        후원자들이 캠페인에 기부

        **조건
        존재하는 캠페인인지 확인
        캠페인가 존재해야함
        기부 금액이 0보다 커야함
        기부자가 가지고있는 포도보다 큰지 확인
    */
    event DonatedTocampaign(uint256 _campaignId, uint256 _amount);

    function donateTocampaign(uint256 _campaignId, uint256 _amount) public {
        // 존재하는 캠페인인지 확인
        require(hasCampaign(_campaignId), "PODO: Not found campaign.");
        // 모금이 끝난 캠페인인지 확인
        require(
            campaignState(_campaignId),
            "PODO: It's not a fundraising period."
        );
        // 기부 금액이 0보다 커야함
        require(_amount > 0, "PODO: The donation amount cannot be zero.");
        // 기부자가 가지고있는 포도보다 큰지 확인
        require(
            _amount <= podo.balanceOf(msg.sender),
            "PODO: It's bigger than the amount you have."
        );
        // 기부의 금액 모금활동으로 받습니다.
        // TODO Podo 토큰을 없애고 다른 토큰으로도 받는 이벤트 고민.
        // 1. 포도 받아야함
        podo.transferFrom(msg.sender, address(this), _amount);
        // 2. 캠페인에 기부한 유저 정보 저장
        userInfo[msg.sender][_campaignId].donateAmount = userInfo[msg.sender][
            _campaignId
        ].donateAmount.add(_amount);
        userInfo[msg.sender][_campaignId].ballotAmount = userInfo[msg.sender][
            _campaignId
        ].ballotAmount.add(_amount);
        // 3. 유저 리스트에 유저 추가
        bool check = false;
        // 이미 배열에 있는지 확인
        for (uint256 i = 0; i < userList[_campaignId].length; i++) {
            if (userList[_campaignId][i] == msg.sender) {
                check = true;
                break;
            }
        }
        if (!check) {
            userList[_campaignId].push(msg.sender);
            userDonatedList[msg.sender].push(_campaignId);
        }
        // 3. 캠페인에 현재 기부금액 업데이트
        campaignList[_campaignId].currentMoney = campaignList[_campaignId]
            .currentMoney
            .add(_amount);
        // 4. 투표권에 기부한 유저 투표권 발급
        // 프론트 이벤트
        emit DonatedTocampaign(_campaignId, _amount);
    }

    /**
        투표권 제거
     */
    function burnBallot(
        address _voter,
        uint256 _campaignId,
        uint256 _amount
    ) public {
        userInfo[_voter][_campaignId].ballotAmount = userInfo[_voter][
            _campaignId
        ].ballotAmount.sub(_amount);
    }

    /**
        현재 모금의 상태

        ** 조건
        캠페인가 존재하는지 확인
    */
    function campaignState(uint256 _campaignId) public view returns (bool) {
        // 캠페인가 존재하는지 확인
        require(hasCampaign(_campaignId), "PODO: Not found campaign.");
        // 캠페인 모금 진행중
        if (block.number <= campaignList[_campaignId].endBlock) {
            return true;
        }
        return false;
    }

    /**
        포도 출금

        **조건
        캠페인가 가지고있는 포도보다 작아야함
    */
    function withdraw(
        address _group,
        uint256 _campaignId,
        uint256 _amount
    ) public {
        // 캠페인가 가지고있는 포도보다 작아야함
        require(
            campaignList[_campaignId].currentMoney >= _amount,
            "PODO: The requested amount is greater than the vault amount."
        );
        // 1. 요청금액 만큼 현재작액에서 제거
        campaignList[_campaignId].currentMoney -= _amount;

        // 2. 포도를 요청한 그룹에게 전송
        podo.transfer(address(_group), _amount);
    }

    /**
        캠페인의 존재여부
     */
    function hasCampaign(uint256 _campaignId) public view returns (bool) {
        if (campaignList.length >= _campaignId) {
            return true;
        }
        return false;
    }
}
