// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IAddressRegistry.sol";

contract FROAddressProxy {
    IAddressRegistry public registry;

    constructor(address registry_){
        registry = IAddressRegistry(registry_);
    }

    modifier onlyAddress(string memory _key) {
        registry.checkRegistory(_key, msg.sender);
        _;
    }

}
