// SPDX-License-Identifier: MIT

import "./openzeppelin/SafeMath.sol";

pragma solidity ^0.8.0;

contract FundRaise {
    using SafeMath for uint256;

    uint256 public mint;
    uint256 public projectCount;
    string public empty = "";

    function projectDelay() public pure returns (uint256) {
        return 1;
    }

    function projectPeriod() public pure returns (uint256) {
        return 17280;
    }

    /**
    프로젝트에 여러 기부자들이 있다.

     */
    struct Project {
        uint256 id;
        string title;
        string desc;
        uint256 targetMoney;
        uint256 currentMoney;
        uint256 startBlock;
        uint256 endBlock;
        mapping(address => Donator) donators;
    }
    struct Donator {
        address donatorAddress;
        uint256 amount;
    }
    podoInterface public podo;
    Project[] public project;
    // 프로젝트 번호 별로 매핑
    mapping(uint256 => Project) public projects;
    // 특정 지갑이 입금한 이더에 PodoToken으로 Swap 가능한 개수
    mapping(address => uint256) payableBalance;

    // Podo 토큰의 메서드를 호출하기 위해 생성자에서 Podo 토큰 주소를 입력합니다.
    constructor(address _podo) {
        podo = podoInterface(_podo);
    }

    // 이더리움을 받는 메서드
    // receive() external payable {
    //     // 이더리움을 입금 받고 받은 만큼 배열에 저장
    //     totalBalance[msg.sender] += msg.value;
    //     payableBalance[msg.sender] += msg.value;
    // }

    // 사용자가 입금한 전체 이더리움 출력합니다.
    // function total(address _to) public view returns (uint256) {
    //     return totalBalance[_to];
    // }

    // PodoToken으로 스왑합니다.
    function swapEtherToPodoToken(address _to, uint256 _amount) public {
        require(payableBalance[_to] >= 0);
        payableBalance[_to] -= _amount;
        podo.mint(_to, _amount);
    }

    function createProject(
        string memory _title,
        string memory _desc,
        uint256 _targetmoney
    ) public returns (uint256) {
        require(
            keccak256(bytes(_title)) != keccak256(bytes(empty)) &&
                keccak256(bytes(_desc)) != keccak256(bytes(empty)) &&
                _targetmoney != 0
        );
        // 시작 블럭, 종료 블럭으로 기간 지정
        uint256 startBlock = block.number.add(projectDelay());
        uint256 endBlock = startBlock.add(projectPeriod());

        projectCount++;
        Project storage newProject = projects[projectCount];
        newProject.id = projectCount;
        newProject.title = _title;
        newProject.desc = _desc;
        newProject.targetMoney = _targetmoney;
        newProject.currentMoney = 0;
        newProject.startBlock = startBlock;
        newProject.endBlock = endBlock;
        return newProject.id;
    }
}

interface podoInterface {
    function mint(address _to, uint256 _amount) external;
}
