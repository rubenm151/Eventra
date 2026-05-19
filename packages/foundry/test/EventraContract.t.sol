// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { EventraContract } from "../contracts/EventraContract.sol";

contract EventraTests is Test {
    EventraContract internal eventra;
    address internal owner = makeAddr("owner");
    address internal buyer = makeAddr("buyer");
    address internal eventCompany = makeAddr("eventCompany");

    event EventCreated(uint256 indexed eventId, string indexed eventName, uint96 ticketPrice, uint48 indexed eventDate);

    string internal testEventName = "TEST";
    string internal testEventDescription = "TEST DESCRIPTION";
    uint96 internal testTicketPrice = 0.1 ether;
    uint48 internal testStartSellDate = uint48(block.timestamp + 1 days);
    uint48 internal testEndSellDate = uint48(block.timestamp + 7 days);
    uint48 internal testEventDate = uint48(block.timestamp + 14 days);
    uint16 internal testTicketRoyalty = 15;
    uint32 internal testTotalTicketNumber = 100;

    function setUp() public {
        eventra = new EventraContract(owner);

        vm.deal(buyer, 10 ether);
        vm.deal(eventCompany, 10 ether);
        vm.deal(address(eventra), 100 ether);
    }

    function test_createEventHappyPath() public {
        //IMPORTANTE SE HA MODIFICADO EL FOUNDRY.TOML CON via_ir = true PARA DESHABILITAR EL FALLO DE "STACK TOO DEEP"

        vm.expectEmit(true, true, false, true);
        emit EventCreated(1, testEventName, testTicketPrice, testEventDate);

        vm.prank(eventCompany);
        eventra.createEvent{ value: 1 ether }(
            testEventName,
            testEventDescription,
            testTicketPrice,
            testStartSellDate,
            testEndSellDate,
            testEventDate,
            testTicketRoyalty,
            testTotalTicketNumber
        );

        (
            string memory eventName,
            string memory eventDescription,
            uint96 ticketPrice,
            uint48 startSellDate,
            uint48 endSellDate,
            uint48 eventDate,
            uint16 ticketRoyalty,
            uint32 totalTicketNumber,
            uint256 eventId,
            address organizer,
            uint256 eventFunds,
            EventraContract.EventState eventState
        ) = eventra.events(1);

        assertEq(testEventName, eventName);
        assertEq(testEventDescription, eventDescription);
        assertEq(testTicketPrice, ticketPrice);
        assertEq(testStartSellDate, startSellDate);
        assertEq(testEndSellDate, endSellDate);
        assertEq(testEventDate, eventDate);
        assertEq(testTicketRoyalty, ticketRoyalty);
        assertEq(testTotalTicketNumber, totalTicketNumber);
        assertGt(eventId, 0);
        assertEq(eventCompany, organizer);
        assertEq(eventFunds, 0); //SERA CAMBIADO
        assertEq(uint256(eventState), uint256(EventraContract.EventState.Active));
    }

    function test_buyTicketHappyPath() private { }

    function test_cancelEvent() private { }

    function test_suspendAccount() private { }

    function test_registerUser() private { }
}
