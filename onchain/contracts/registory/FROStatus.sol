// SPDX-License-Identifier: CC0

pragma solidity ^0.8.9;

import "../address/FROAddressesProxy.sol";
import "../interfaces/IStatus.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FROStatus is IStatus, Ownable, FROAddressesProxy {
    constructor(address registry_) FROAddressesProxy(registry_) {}

    // mapping(tokenId => Status)
    mapping(uint => IStatus.Status) private status;
    // mapping(tokenId => color)
    mapping(uint => uint8) public override color;
    // mapping(tokenId => weapon)
    mapping(uint => uint8) public override weapon;

    function getStatus(uint tokenId)
        external
        view
        override
        returns (IStatus.Status memory)
    {
        return status[tokenId];
    }

    function setStatusByOwner(uint[] calldata _tokenIds, IStatus.Status[] calldata _status, uint8[] calldata _weapons, uint8[] calldata _colors)
        external
        override
        onlyOwner
    {
        require(
            _tokenIds.length == _status.length && _tokenIds.length == _weapons.length && _tokenIds.length == _colors.length,
            "input length must be same"
        );
        for (uint8 i = 0; i < _tokenIds.length; i++) {
            _setStatus(_tokenIds[i], _status[i]);
            _setWeapon(_tokenIds[i], _weapons[i]);
            _setColor(_tokenIds[i], _colors[i]);
        }
    }

    //TODO from check
    // function setStatus(uint tokenId, IStatus.Status calldata status_)
    //     external
    //     override
    // {
    //     
    //     _setStatus(tokenId, status_);
    // }

    function _setStatus(uint tokenId, IStatus.Status calldata status_)
        internal
    {
        status[tokenId] = status_;
    }

    function _setColor(uint _tokenId, uint8 _color)
        internal
    {
        color[_tokenId] = _color;
    }

    function _setWeapon(uint _tokenId, uint8 _weapon)
        internal
    {
        weapon[_tokenId] = _weapon;
    }

}
