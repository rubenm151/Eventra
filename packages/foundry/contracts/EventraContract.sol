// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/* Currently this is not available, might be implemented later if given enough time
enum CompanyVerificationState {
    PendingVerification,
    Verified,
    Denied,
    Banned
}
*/

enum EventState {
    Active,
    Expired,
    Canceled,
    Finished
}

enum TicketState {
    Active,
    Transfered,
    inResell,
    Used,
    Cancelled,
    Reimbursed
}

struct Event {
    bytes32 eventName;
    string eventDescription;
    uint96 ticketPrice;
    uint48 startSellDate;
    uint48 endSellDate;
    uint48 eventDate;
    uint16 ticketRoyalty;
    uint32 totalTicketNumber;
}

error InvalidAmount();
error TicketNotFound();
error EventNotFound();
error InvalidEventState();
error InvalidTicketState();
error SalesClosed();
error Unauthorized();
error PayoutNotActiveYet();
error PayoutAlreadyPaid();
error InvalidAddress();
error NotValidPayout();
error TransferFailed();

contract EventraContract {
    address public owner;
    uint256 public nextEventId;

    uint256 public constant EVENT_DEPOSIT = 1 ether;
    uint16 public constant MINIMUM_ROYALTY = 10;
    uint16 public constant MAXIMUM_ROYALTY = 25;

    constructor(address _owner) payable {
        if (_owner == address(0)) {
            revert InvalidAddress();
        }

        owner = _owner;
        nextEventId = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //las fechas se pasarian en formato UNIX: 1778966678 10 digits
    function createEvent(
        bytes32 eventName,
        string memory eventDescription,
        uint96 ticketPrice,
        uint48 startSellDate,
        uint48 endSellDate,
        uint48 eventDate,
        uint16 ticketRoyalty,
        uint32 totalTicketNumber
    ) external payable {

        
     }

    receive() external payable { }
}
