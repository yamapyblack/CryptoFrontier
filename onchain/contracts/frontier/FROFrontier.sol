// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../lib/FROAddressProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IFrontier.sol";

contract FROFrontier is Ownable, FROAddressProxy, IFrontier {
    // mapping(frontierID => tokenID)
    mapping(uint256 => uint256) public override frontiers;

    constructor(address registry_) FROAddressProxy(registry_) {}

    function setFrontier(uint256 frontierId, uint256 tokenId)
        external
        override
        onlyOwner
    {
        frontiers[frontierId] = tokenId;
    }
}
