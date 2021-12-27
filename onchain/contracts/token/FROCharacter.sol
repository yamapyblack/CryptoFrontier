// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../lib/ERC721Mintable.sol";
import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ITokenDescriptor.sol";
import "../interfaces/ICharacter.sol";
// import "../interfaces/IStatus.sol";
// import "../interfaces/IHpRegistory.sol";

contract FROCharacter is ICharacter, ERC721Mintable, Ownable, FROAddressesProxy {
    constructor(address registry_)
        ERC721Mintable("FROCharacter", "FROC")
        FROAddressesProxy(registry_)
    {}

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ICharacter)
        returns (string memory)
    {
        require(_exists(tokenId), "nonexistent token");
        return
            ITokenDescriptor(registry.getRegistry("FROTokenDescriptor"))
                .tokenURI(this, tokenId);
    }

    function mintByLogic(address to, uint256 tokenId) external override {
        registry.checkRegistory("FROMintLogic", msg.sender);
        _mint(to, tokenId);
    }
}
