// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../address/FROAddressesProxy.sol";
import "../interfaces/IStatus.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FROStatus is IStatus, Ownable, FROAddressesProxy {
    constructor(address registry_) FROAddressesProxy(registry_) {}

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
        //TODO from check
        _setStatus(tokenId, status_);
    }

    function _setStatus(uint256 tokenId, IStatus.Status calldata status_)
        private
    {
        status[tokenId] = status_;
    }
}
