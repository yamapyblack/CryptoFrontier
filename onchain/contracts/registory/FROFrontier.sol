// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

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

    function _setFrontier(uint _frontierId, IFrontier.Frontier memory _frontier) internal {
        require(_frontierId <= maxFrontier, "over max frontiers");
        frontiers[_frontierId] = _frontier;
    }

    function setFrontier(uint _frontierId, uint _tokenIdA, uint _tokenIdB)
        override
        external
    {
        registry.checkRegistory("FROLogic", msg.sender);
        _setFrontier(_frontierId, IFrontier.Frontier(_tokenIdA, _tokenIdB, block.number));
    }

    function clearFrontier(uint _frontierId) external override {
        registry.checkRegistory("FROLogic", msg.sender);
        require(_frontierId <= maxFrontier, "over max frontiers");

        _setFrontier(_frontierId, IFrontier.Frontier(0, 0, 0));
    }
}
