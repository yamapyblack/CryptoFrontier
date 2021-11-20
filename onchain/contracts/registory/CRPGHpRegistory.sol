// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IHpRegistory.sol";
import "../interfaces/IAddressRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CRPGHpRegistory is IHpRegistory, Ownable {
    IAddressRegistry public registry;

    constructor(address registry_) {
        registry = IAddressRegistry(registry_);
    }

    // mapping(tokenId => hp)
    mapping(uint256 => IHpRegistory.Hp) private battleHp;

    function getHp(uint256 tokenId)
        external
        view
        override
        returns (IHpRegistory.Hp memory)
    {
        return battleHp[tokenId];
    }

    function setBattleHp(uint256 tokenId, uint256 hp) external override {
        //TODO onlyBattleContract
        registry.checkRegistory("CRPGCharacter", msg.sender);

        battleHp[tokenId] = IHpRegistory.Hp(hp, block.timestamp);
    }

    function _reduceBattleHp(uint256 tokenId, uint256 hpDiff, uint256 timestamp)
        internal
        returns (uint256)
    {
        // if character is dead, hp = 0
        uint256 hp = 0;
        if (battleHp[tokenId].hp > hpDiff) {
            hp = battleHp[tokenId].hp - hpDiff;
        }
        battleHp[tokenId] = IHpRegistory.Hp(hp, timestamp);

        return hp;        
    }

    function reduceBattleHp(uint256 tokenId, uint256 hpDiff)
        external
        override
        returns (uint256)
    {
        registry.checkRegistory("CRPGBattle", msg.sender);
        return _reduceBattleHp(tokenId, hpDiff, block.timestamp);
    }
}
