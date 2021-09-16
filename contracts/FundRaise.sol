contract FundRaise {
    uint256 public mint;
    podoInterface public podo;
    Project public projects;
    address[] public donator;

    struct Project {
        string title;
        string desc;
        uint256 targetmoney;
        uint256 currentmoney;
        uint256 state;
        address[] donator;
    }

    mapping(address => uint256) totalBalance;
    mapping(address => uint256) payableBalance;

    // event Received (address _to, uint _amount);
    receive() external payable {
        totalBalance[msg.sender] += msg.value;
        payableBalance[msg.sender] += msg.value;
        donator.push(msg.sender);
    }

    constructor(address _podo) {
        podo = podoInterface(_podo);
    }

    function total(address _to) public view returns (uint256) {
        return totalBalance[_to];
    }

    // PodoToken으로 스왑합니다.
    function swapEtherToPodoToken(address _to, uint256 _amount) public {
        require(payableBalance[_to] >= 0);
        payableBalance[_to] -= _amount;
        podo.mint(_to, _amount);
    }
}

interface podoInterface {
    function mint(address _to, uint256 _amount) external;
}
