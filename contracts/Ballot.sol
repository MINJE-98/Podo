// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./openzeppelin/IERC20.sol";
import "./openzeppelin/ERC20.sol";
import "./openzeppelin/SafeMath.sol";

contract Ballot is ERC20("Ballot", "BALLOT") {
    using SafeMath for uint256;
    // 유저정보
    struct UserInfo {
        uint256 donateAmount;
        uint256 hasVoted;
    }
    // 그룹 주소 ->  유저 주소
    mapping(address => mapping(address => UserInfo)) public userInfo;

    modifier onlyContract() {
        require(
            msg.sender == address(this),
            "PODO: This method can only call BALLET."
        );
        _;
    }

    // 투표권을 생성
    function mint(
        address _group,
        address _to,
        uint256 _amount
    ) public onlyOwner {
        // 유저 인스턴스 생성
        UserInfo storage user = userInfo[_group][_to];
        // 유저 기부 금액 유저 정보에 저장
        user.donateAmount = user.donateAmount.add(_amount);
        // 기부자에게 투표권 지급
        _mint(_to, _amount);
    }

    /**
        투표권 제거
     */
    function burnBallot(address _to, uint256 _amount) public {
        _burn(_to, _amount);
    }

    /**
        프로젝트에 투표를 함

        * 투표권 제거
        투표를 진행하는 경우 투표권이 소진됩니다.
        **조건
        유저의 투표권이 총 기부금액보다 작아야함.
     */
    function voteToProject(
        address _voter,
        address _group,
        uint256 _amount
    ) public {
        // 유저 정보 인스턴스 생성
        UserInfo storage user = userInfo[_group][_voter];
        // 유저의 투표가능한 투표수는 자신이 기부한 갯수를 넘길 수 없음
        require(
            user.donateAmount >= _amount,
            "PODO: Over the total number of votes."
        );
        // 전체 기부금액과 hasVoted양이 같으면 더이상 투표가 불가능
        require(
            user.donateAmount != user.hasVoted && user.donateAmount != 0,
            "PODO: You no longer have the right to vote available."
        );
        // 유저가 투표한 개수를 저장
        user.hasVoted += _amount;
        // 투표한 만큼 투표권 제거
        burnBallot(_voter, _amount);
    }
}
