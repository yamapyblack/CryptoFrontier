// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../lib/ERC721Mintable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ITokenDescriptor.sol";
import "../interfaces/ICharacter.sol";
import "../interfaces/IStatus.sol";
import "../interfaces/IHpRegistory.sol";
import "../interfaces/IAddressRegistry.sol";

contract CRPGCharacter is ERC721Mintable, Ownable {
    IAddressRegistry public registry;

    constructor(address registry_) ERC721Mintable("CryptoRPG", "CRPG") {
        registry = IAddressRegistry(registry_);
    }

    using Strings for uint256;

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), 'nonexistent token');
        return ITokenDescriptor(registry.getRegistry("CRPGTokenDescriptor")).tokenURI(this, tokenId);
    }

    function mintSetStatus(address to, uint256 tokenId, IStatus.Status calldata status_) external {
        super.mint(to, tokenId);
        IStatus(registry.getRegistry("CRPGStatus")).setStatus(tokenId, status_);
        IHpRegistory(registry.getRegistry("CRPGHpRegistory")).setBattleHp(tokenId, status_.hp);
    }

}
