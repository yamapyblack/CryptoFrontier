// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IBattle.sol";
import "../interfaces/IStatus.sol";
import "../interfaces/ICharacter.sol";
import "../interfaces/IAddressRegistry.sol";
import "../interfaces/IHpRegistory.sol";
import "../interfaces/IResultRegistory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FROBattle is IBattle, ReentrancyGuard, Ownable {
    IAddressRegistry public registry;

    constructor(address registry_) {
        registry = IAddressRegistry(registry_);
    }

    function battle(uint256 playerTokenId, uint256 enemyTokenId)
        external
        override
        nonReentrant
        returns (uint256)
    {
        require(
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(
                playerTokenId
            ) == msg.sender,
            "sender is not owner of playerTokenId"
        );

        //TODO check enemyTokenId

        uint256 playerHp = IHpRegistory(registry.getRegistry("FROHpRegistory"))
            .getHp(playerTokenId)
            .hp;
        uint256 enemyHp = IHpRegistory(registry.getRegistry("FROHpRegistory"))
            .getHp(enemyTokenId)
            .hp;

        IStatus.Status memory playerSt = IStatus(
            registry.getRegistry("FROStatus")
        ).getStatus(playerTokenId);
        IStatus.Status memory enemySt = IStatus(
            registry.getRegistry("FROStatus")
        ).getStatus(enemyTokenId);

        //TODO speed判定

        for (uint8 i = 0; i < 2; i++) {
            // player attack
            enemyHp = IHpRegistory(registry.getRegistry("FROHpRegistory"))
                .reduceBattleHp(enemyTokenId, _calcDamage(playerSt, enemySt));
            // player win
            if (enemyHp == 0) {
                return _setResult(playerTokenId, enemyTokenId);
            }

            // enemy attack
            playerHp = IHpRegistory(registry.getRegistry("FROHpRegistory"))
                .reduceBattleHp(playerTokenId, _calcDamage(enemySt, playerSt));
            // enemy win
            if (playerHp == 0) {
                return _setResult(enemyTokenId, playerTokenId);
            }
        }

        return 0;
    }

    function _calcDamage(
        IStatus.Status memory attacker,
        IStatus.Status memory deffender
    ) private returns (uint256) {
        return attacker.at - (deffender.df / 2);
    }

    function _setResult(uint256 winnerTokenId, uint256 loserTokenId)
        private
        returns (uint256)
    {
        IResultRegistory.Result memory result = IResultRegistory.Result(
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(
                winnerTokenId
            ),
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(
                loserTokenId
            ),
            winnerTokenId,
            loserTokenId,
            block.timestamp
        );
        return
            IResultRegistory(registry.getRegistry("FROResultRegistory"))
                .setResult(result);
    }
}
