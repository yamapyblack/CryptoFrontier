// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../interfaces/IReward.sol";
import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ICharacter.sol";
// import "../interfaces/IToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

        IERC20(registry.getRegistry("FROToken")).transfer(msg.sender, rewards[_tokenId]);
        rewards[_tokenId] = 0;
    }

    function withdrawReward(uint[] calldata _tokenIds) external override {
        uint totalRewards = 0;
        for(uint8 i = 0; i < _tokenIds.length; i++){
            require(
                ICharacter(registry.getRegistry("FROCharacter")).ownerOf(_tokenIds[i]) == msg.sender,
                "sender is not owner of tokenId"
            );
            totalRewards += rewards[_tokenIds[i]];
            rewards[_tokenIds[i]] = 0;
        }

        IERC20(registry.getRegistry("FROToken")).transfer(msg.sender, totalRewards);
    }

}
