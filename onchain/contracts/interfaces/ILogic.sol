// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ILogic {
    function stake(uint256 tokenId, uint256 frontierId) external;

    function unStake(uint256 tokenId) external;

    function revive(uint256 tokenId) external;
    function canRevive(uint256 tokenId, uint _blockNumber) external view returns(bool);

    function getBothBattleHp(uint256 frontierId)
        external
        returns (
            uint256 hpA,
            uint256 hpB,
            uint256 deadBlock
        );
}
