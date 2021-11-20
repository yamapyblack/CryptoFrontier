// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IHpRegistory.sol";
import "../interfaces/IAddressRegistry.sol";
import "../interfaces/IRevive.sol";
import "../interfaces/ICharacter.sol";
import "../interfaces/IStatus.sol";

contract CRPGRevive is IRevive {
    IAddressRegistry public registry;

    constructor(address registry_) {
        registry = IAddressRegistry(registry_);
    }

    function revive(uint256 tokenId) external override {
        require(
            ICharacter(registry.getRegistry("CRPGCharacter")).ownerOf(
                tokenId
            ) == msg.sender,
            "sender is not owner of tokenId"
        );

        IHpRegistory.Hp memory hp = IHpRegistory(
            registry.getRegistry("CRPGHpRegistory")
        ).getHp(tokenId);

        require(hp.hp == 0, "hp is not 0");

        require(
            block.timestamp > hp.timestamp + 24 hours,
            "must be past 24 hours"
        );

        // TODO max hp from status
        uint256 maxHp = IStatus(registry.getRegistry("CRPGStatus"))
            .getStatus(tokenId)
            .hp;
        IHpRegistory(registry.getRegistry("CRPGHpRegistory")).setBattleHp(
            tokenId,
            maxHp
        );
    }
}
