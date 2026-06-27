// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script, console } from "forge-std/Script.sol";
import { EventraContract } from "../contracts/EventraContract.sol";

contract Deploy is Script {
    function run() external returns (address) {
        vm.startBroadcast();
        EventraContract eventra = new EventraContract(msg.sender, 5);
        vm.stopBroadcast();

        console.log("Eventra deployed to:", address(eventra));

        return address(eventra);
    }
}
