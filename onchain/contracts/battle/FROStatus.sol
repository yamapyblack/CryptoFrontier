// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../lib/FROAddressProxy.sol";
import "../interfaces/IStatus.sol";
import "../interfaces/IAddressRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FROStatus is IStatus, Ownable, FROAddressProxy {
    constructor(address registry_) FROAddressProxy(registry_) {}

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
        onlyOwner
    {
        _setStatus(tokenId, status_);
    }

    function _setStatus(uint256 tokenId, IStatus.Status calldata status_)
        private
    {
        status[tokenId] = status_;
    }
}
