// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IBattle {
    function battle(uint256 playerTokenId, uint256 enemyTokenId) external returns(uint);
}
