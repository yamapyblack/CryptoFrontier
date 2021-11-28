// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IFrontier  {
    struct Frontier {
        uint tokenIdA;
        uint tokenIdB;
        uint blockNumber;
    }
    function getFrontier(uint _frontierId) external view returns (IFrontier.Frontier memory);
    function setFrontier(uint _frontierId, IFrontier.Frontier memory _frontier) external;
    function setMaxFrontier(uint _maxFrontier) external;
}
