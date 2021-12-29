// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../interfaces/IReward.sol";
import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ICharacter.sol";
import "../interfaces/IToken.sol";

contract FROReward is IReward, FROAddressesProxy, Ownable {

    constructor(address registory_) FROAddressesProxy(registory_) {}

    // mapping(tokenId => amount)
    mapping(uint => uint) public override rewards;

    function setReward(uint _tokenId, uint _reward) external override {
        registry.checkRegistory("FROLogic", msg.sender);
        rewards[_tokenId] = _reward;
    }

    function addReward(uint _tokenId, uint _addReward) external override {
        registry.checkRegistory("FROLogic", msg.sender);
        rewards[_tokenId] += _addReward;
    }

    function withdrawReward(uint _tokenId) external override {
        require(
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(_tokenId) == msg.sender,
            "sender is not owner of tokenId"
        );
        require(rewards[_tokenId] > 0,"tokenId has no reward");

        IToken(registry.getRegistry("FROToken")).mint(msg.sender, rewards[_tokenId]);
        rewards[_tokenId] = 0;
    }

}
