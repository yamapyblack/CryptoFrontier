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

    function mint(address to, uint256 tokenId)
        public
        virtual
        override
        onlyOwner
    {
        super._mint(to, tokenId);
    }

    function mint(address[] memory _toList, uint256[] memory _tokenIdList) external onlyOwner
    {
        require(
            _toList.length == _tokenIdList.length,
            "input length must be same"
        );
        for (uint8 i = 0; i < _tokenIdList.length; i++) {
            super._mint(_toList[i], _tokenIdList[i]);
        }
    }
}
