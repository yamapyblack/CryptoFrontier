// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IMintLogic.sol";
import "../interfaces/IStatus.sol";
import "../interfaces/IHp.sol";
import "../interfaces/ICharacter.sol";

contract FROMintLogic is Ownable, FROAddressesProxy, IMintLogic {

    uint public maxTokenId = 128;

    constructor(address registory_) FROAddressesProxy(registory_) {}

    function setMaxTokenId(uint _maxTokenId) external onlyOwner{
        require(maxTokenId < _maxTokenId, "must be over maxTokenId");
        maxTokenId = _maxTokenId;
    }

    function claim(uint _tokenId) external override {
        //minimum 1
        require(_tokenId > 0 && _tokenId < maxTokenId, "tokdnId is out of range");

        ICharacter c = ICharacter(registry.getRegistry("FROCharacter"));
        c.mintByLogic(msg.sender, _tokenId);
        
        uint hp = IStatus(registry.getRegistry("FROStatus")).getStatus(_tokenId).hp;
        IHp(registry.getRegistry("FROHp")).setHpByMint(_tokenId, hp);
    }

}
