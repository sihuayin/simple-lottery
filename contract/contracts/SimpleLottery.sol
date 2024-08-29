// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleLottery {
    struct LotteryType {
        uint256 id;
        string title;
        string description;
        string image;
        uint256 totalTickets;
        uint256 ticketPrice;
        uint256 participants;
        bool drawn;
        address owner;
        uint256 createdAt;
        uint256 expiresAt;
    }

    uint public unlockTime;
    address payable public owner;
    uint256 private counter;
    mapping(uint256 => LotteryType) lotteries;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        counter = 0;
        owner = payable(msg.sender);
    }

    function createLottery(
        string memory title,
        string memory description,
        string memory image,
        uint256 totalTickets,
        uint256 ticketPrice,
        uint256 expiresAt
    ) public payable {
        require(bytes(title).length > 0, "title cannot be empty");
        require(bytes(description).length > 0, "description cannot be empty");
        require(bytes(image).length > 0, "image cannot be empty");
        require(totalTickets > 0, "totalTickets cannot be zero");
        require(ticketPrice > 0 ether, "ticketPrice cannot be zero");
        require(
            expiresAt > block.timestamp,
            "expireAt cannot be less than the future"
        );
        counter++;

        LotteryType memory lottery;

        lottery.id = counter;
        lottery.title = title;
        lottery.description = description;
        lottery.image = image;
        lottery.totalTickets = totalTickets;
        lottery.ticketPrice = ticketPrice;
        lottery.owner = msg.sender;
        lottery.createdAt = block.timestamp;
        lottery.expiresAt = expiresAt;

        lotteries[lottery.id] = lottery;
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    function getUnlockTime() public view returns (uint) {
        return unlockTime;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }

    function getLotteries()
        public
        view
        returns (LotteryType[] memory Lotteries)
    {
        Lotteries = new LotteryType[](counter);

        for (uint256 i = 1; i <= counter; i++) {
            Lotteries[i - 1] = lotteries[i];
        }
    }

    function getLottery(uint256 id) public view returns (LotteryType memory) {
        return lotteries[id];
    }

    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}
