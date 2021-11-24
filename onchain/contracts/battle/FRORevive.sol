// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IHpRegistory.sol";
import "../interfaces/IAddressRegistry.sol";
import "../interfaces/IRevive.sol";
import "../interfaces/ICharacter.sol";
import "../interfaces/IStatus.sol";

contract FRORevive is IRevive {
    IAddressRegistry public registry;

    constructor(address registry_) {
        registry = IAddressRegistry(registry_);
    }

    function revive(uint256 tokenId) external override {
        require(
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(
                tokenId
            ) == msg.sender,
            "sender is not owner of tokenId"
        );

        IHpRegistory.Hp memory hp = IHpRegistory(
            registry.getRegistry("FROHpRegistory")
        ).getHp(tokenId);

        require(hp.hp == 0, "hp is not 0");

        require(
            block.timestamp > hp.timestamp + 24 hours,
            "must be past 24 hours"
        );

        // TODO max hp from status
        uint256 maxHp = IStatus(registry.getRegistry("FROStatus"))
            .getStatus(tokenId)
            .hp;
        IHpRegistory(registry.getRegistry("FROHpRegistory")).setBattleHp(
            tokenId,
            maxHp
        );
    }
}
