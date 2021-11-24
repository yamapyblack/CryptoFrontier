// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IFrontier.sol";

contract StorageTest{
    // mapping(frontierID => tokenID)
    mapping(uint256 => IFrontier.Frontier) private frontiers;

    function setFrontier(IFrontier.Frontier memory frontier) external {
        frontiers[1] = frontier;
    }

    function changeFrontier(uint tokenId) external {
        IFrontier.Frontier storage f = frontiers[1];
        f.tokenIdB = tokenId;
    }
    
    function getFrontier(uint256 tokenId)
        external
        view
        returns (IFrontier.Frontier memory)
    {
        return frontiers[tokenId];
    }

}
