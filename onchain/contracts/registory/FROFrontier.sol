// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IFrontier.sol";

contract FROFrontier is Ownable, FROAddressesProxy, IFrontier {

    constructor(address registory_) FROAddressesProxy(registory_) {}

    uint public maxFrontier = 64;

    // mapping(frontierID => tokenID)
    mapping(uint => IFrontier.Frontier) frontiers;

    function setMaxFrontier(uint _maxFrontier) external override onlyOwner{
        maxFrontier = _maxFrontier;
    }

    function getFrontier(uint _frontierId)
        override
        external
        view
        returns (IFrontier.Frontier memory)
    {
        return frontiers[_frontierId];
    }

    function setFrontier(uint _frontierId, IFrontier.Frontier memory _frontier)
        override
        external
    {
        require(_frontierId <= maxFrontier, "over max frontiers");
        registry.checkRegistory("FROLogic", msg.sender);
        frontiers[_frontierId] = _frontier;
    }
}
