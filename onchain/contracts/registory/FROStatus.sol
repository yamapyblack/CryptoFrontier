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

    function setStatusByOwner(uint[] calldata _tokenIds, IStatus.Status[] calldata _status)
        external
        override
        onlyOwner
    {
        require(
            _tokenIds.length == _status.length,
            "input length must be same"
        );
        for (uint8 i = 0; i < _tokenIds.length; i++) {
            _setStatus(_tokenIds[i], _status[i]);
        }
    }

    //TODO from check
    // function setStatus(uint256 tokenId, IStatus.Status calldata status_)
    //     external
    //     override
    // {
    //     
    //     _setStatus(tokenId, status_);
    // }

    function _setStatus(uint256 tokenId, IStatus.Status calldata status_)
        internal
    {
        status[tokenId] = status_;
    }
}
