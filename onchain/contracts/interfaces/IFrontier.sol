// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IFrontier  {
    function frontiers(uint256 tokenId) external view returns (uint);
    function setFrontier(uint frontierId, uint tokenId) external;
}
