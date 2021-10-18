// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/SafeMath.sol";

contract Ballot is ERC20("Ballot", "BALLOT") {
    //     using SafeMath for uint256;
    //     // 유저정보
    //     struct UserInfo {
    //         uint256 ballotAmount;
    //     }
    //     // 캠페인 1개당 유저 정보 N개
    //     // 내 주소 1개당 캠페인 N개 유저정보 N개
    //     // 내 주소 1개당 캠페인 N개
    //     // 기부한 캠페인 뽑아보려면?
    //     // 캠페인 아이디를 개별로 들고있어야함
    //     // 주소 -> 유저 정보 아이디
    //     // mapping(address => uint256[]) public donatedCampaignList;
    //     // // 캠페인의 제안에 투표 여부
    //     // mapping(uint256 => mapping(uint256 => bool)) public isVoted;
    //     UserInfo[] public userInfo;
    //     // // 캠페인에 기부한 유저 아이디 리스트
    //     // mapping(uint256 => ui) public campaignUserList;
    //     modifier onlyContract() {
    //         require(
    //             msg.sender == address(this),
    //             "PODO: This method can only call BALLET."
    //         );
    //         _;
    //     }
    //     function getDonateCampaignList() public view returns (uint256[] memory) {
    //         return donatedCampaignList[msg.sender];
    //     }
    //     /**
    //         투표권 생성
    //      */
    //     function mint(
    //         uint256 _campaignId,
    //         uint256 _amount,
    //         address _to
    //     ) public onlyOwner {
    //         // 1. 유저가 기부한 캠페인 추가
    //         uint256[] storage projectlist = donatedCampaignList[_to];
    //         projectlist.push(_campaignId);
    //         // 2. 캠페인 아이디에 해당하는 유저 정보 저장
    //         UserInfo storage newuserInfo = userInfo[_campaignId];
    //         newuserInfo.voteAmount = _amount;
    //         // 3. 투표권 발급
    //         _mint(_to, _amount);
    //     }
    //     /**
    //         투표권 제거
    //      */
    //     function burnBallot(address _to, uint256 _amount) public {
    //         _burn(_to, _amount);
    //     }
    //     /**
    //         기부한 캠페인 갯수
    //      */
    //     function campaignLength() public view returns (uint256) {
    //         return donatedCampaignList[msg.sender].length;
    //     }
    //     /**
    //         캠페인에 투표를 함
    //         * 투표권 제거
    //         투표를 진행하는 경우 투표권이 소진됩니다.
    //         **조건
    //         유저의 투표권이 총 기부금액보다 작아야함.
    //      */
    //     function voteToProject(
    //         address _voter,
    //         uint256 _proposeId,
    //         uint256 _campaignId,
    //         uint256 _amount
    //     ) public {
    //         // 유저 정보 인스턴스 생성
    //         UserInfo storage user = userInfo[_campaignId];
    //         // 유저의 투표가능한 투표수는 자신이 기부한 갯수를 넘길 수 없음
    //         require(
    //             user.voteAmount >= _amount,
    //             "PODO: Over the total number of votes."
    //         );
    //         // 이미 투표했다면 더이상 투표 불가능
    //         require(!isVoted[_campaignId][_proposeId], "PODO: Already voted");
    //         // 1. 유저가 투표한 투표권수를 현재 투표권수에서 빼준다.
    //         user.voteAmount = user.voteAmount.sub(_amount);
    //         // 2. 제안서에 투표 여부를 변경해준다.
    //         isVoted[_campaignId][_proposeId] = true;
    //         // 3. 기존에 들고있던 투표권을 없애준다.
    //         burnBallot(_voter, _amount);
    //     }
}
