// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IStatus.sol";
import "../interfaces/IAddressRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CRPGStatus is IStatus, Ownable {
    IAddressRegistry public registry;

    constructor(address registry_) {
        registry = IAddressRegistry(registry_);
    }

    // mapping(tokenId => Status)
    mapping(uint256 => IStatus.Status) private status;

    function getStatus(uint256 tokenId)
        external
        view
        override
        returns (IStatus.Status memory)
    {
        return status[tokenId];
    }

    function setStatus(uint256 tokenId, IStatus.Status calldata status_)
        external
        override
    {
        registry.checkRegistory("CRPGCharacter", msg.sender);
        status[tokenId] = status_;
    }
}
