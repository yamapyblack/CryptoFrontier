// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IAddresses.sol";

contract FROAddressesProxy {
    IAddresses public registry;

    constructor(address registry_){
        registry = IAddresses(registry_);
    }

    modifier onlyAddress(string memory _key) {
        registry.checkRegistory(_key, msg.sender);
        _;
    }

}
