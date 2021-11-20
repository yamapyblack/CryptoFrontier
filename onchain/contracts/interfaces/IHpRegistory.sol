// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IHpRegistory {
    struct Hp {
        uint hp;
        uint timestamp;
    }
    function getHp(uint256 tokenId) external returns(Hp memory);
    function setBattleHp(uint256 tokenId, uint hp) external;
    function reduceBattleHp(uint256 tokenId, uint hpDiff) external returns(uint);
}
