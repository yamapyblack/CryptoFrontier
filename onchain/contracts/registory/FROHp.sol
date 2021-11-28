// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IHp.sol";
import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FROHp is IHp, FROAddressesProxy, Ownable {

    constructor(address registory_) FROAddressesProxy(registory_) {}

    // mapping(tokenId => hp)
    mapping(uint256 => IHp.Hp) private tokenHp;

    // TODO これでバトル中のHPは取得不可能
    function getHp(uint256 _tokenId)
        external
        view
        override
        returns (IHp.Hp memory)
    {
        return tokenHp[_tokenId];
    }

    function setHp(uint256 _tokenId, uint256 _hp) external override {
        registry.checkRegistory("FROLogic", msg.sender);
        _setHp(_tokenId, _hp);
    }

    function _setHp(uint256 _tokenId, uint256 _hp) internal {
        tokenHp[_tokenId] = IHp.Hp(_hp, block.number);
    }

    function _reduceHp(uint256 _tokenId, uint256 _hpDiff, uint256 _blockNumber)
        internal
        returns (uint256)
    {
        // if character is dead, hp = 0
        uint256 _hp = 0;
        if (tokenHp[_tokenId].hp > _hpDiff) {
            _hp = tokenHp[_tokenId].hp - _hpDiff;
        }
        tokenHp[_tokenId] = IHp.Hp(_hp, _blockNumber);

        return _hp;        
    }

    function reduceHp(uint256 _tokenId, uint256 _hpDiff)
        external
        override
        returns (uint256)
    {
        registry.checkRegistory("FROLogic", msg.sender);
        return _reduceHp(_tokenId, _hpDiff, block.number);
    }
}
