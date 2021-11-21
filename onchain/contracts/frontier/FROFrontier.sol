// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../lib/FROAddressProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../interfaces/IFrontier.sol";
import "../interfaces/IToken.sol";
import "../interfaces/ICharacter.sol";

contract FROFrontier is Ownable, FROAddressProxy, IFrontier, IERC721Receiver {
    // TODO separate contract into login and storage
    // mapping(frontierID => tokenID)
    mapping(uint256 => IFrontier.Frontier) private frontiers;

    constructor(address registry_) FROAddressProxy(registry_) {}

    function getFrontier(uint256 tokenId)
        override
        external
        view
        returns (IFrontier.Frontier memory)
    {
        return frontiers[tokenId];
    }

    function stake(uint tokenId, uint frontierId) override external {
        ICharacter character = ICharacter(registry.getRegistry("FROCharacter"));

        require(
            character.ownerOf(tokenId) == msg.sender,
            "sender is not owner of tokenId"
        );

        //TODO approve check
        character.safeTransferFrom(msg.sender, address(this), tokenId);

        //TODO if there is already token, starting battle

        frontiers[frontierId] = IFrontier.Frontier(tokenId, msg.sender, block.number);

        //TODO event
    }

    function unStake(uint frontierId) override external {
        ICharacter character = ICharacter(registry.getRegistry("FROCharacter"));
        IFrontier.Frontier memory f = frontiers[frontierId];

        require(
            f.staker == msg.sender,
            "sender is not staker"
        );

        uint reward = calcReward(block.number - f.blockNumber);
        IToken(registry.getRegistry("FROToken")).mint(msg.sender, reward);
    }

    function calcReward(uint number) private returns(uint) {
        return number * 100;
    }

    function revive(uint256 tokenId) override external {
        //TODO
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) override external returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
