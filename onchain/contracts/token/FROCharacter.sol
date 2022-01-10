// SPDX-License-Identifier: CC0

pragma solidity ^0.8.9;

import "../lib/ERC721Mintable.sol";
import "../lib/ERC721Permit.sol";
import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ITokenDescriptor.sol";
import "../interfaces/ICharacter.sol";

contract FROCharacter is ICharacter, ERC721Mintable, ERC721Permit, Ownable, FROAddressesProxy {
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
        super._mint(to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Mintable, IERC165, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Mintable, ERC721){
        super._beforeTokenTransfer(from, to, tokenId);
    }

}
