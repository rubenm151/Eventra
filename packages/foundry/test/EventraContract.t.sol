// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { EventraContract } from "../contracts/EventraContract.sol";

contract EventraTests is Test {
    EventraContract private eventra;
    address private owner = makeAddr("owner");
    address private buyer = makeAddr("buyer");

    function setUp() public {
        eventra = new EventraContract(owner);

        vm.deal(buyer, 10 ether);
        vm.deal(address(eventra), 100 ether);
    }

    function test_CreateEventHappyPath() private { }

    function test_buyTicketHappyPath() private { }

    function test_cancelEvent() private { }

    function test_suspendAccount() private { }

    function test_registerUser() private { }
}
