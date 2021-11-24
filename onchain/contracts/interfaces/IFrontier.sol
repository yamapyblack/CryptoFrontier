// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IFrontier  {
    struct Frontier {
        uint tokenIdA;
        uint tokenIdAHp;
        uint tokenIdB;
        uint tokenIdBHp;
        uint blockNumber;
        // bool isBattle;
    }

    struct Stake {
        uint frontierId;
        address staker;
        uint blockNumber;
    }

    function getFrontier(uint256 tokenId) external view returns (IFrontier.Frontier memory);

    function stake(uint256 tokenId, uint256 frontierId) external;
    function unStake(uint256 frontierId) external;
    function revive(uint256 tokenId) external;
}
