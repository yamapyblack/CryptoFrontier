// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ILogic  {
    function stake(uint256 tokenId, uint256 frontierId) external;
    function unStake(uint256 frontierId) external;
    function revive(uint256 tokenId) external;
}
