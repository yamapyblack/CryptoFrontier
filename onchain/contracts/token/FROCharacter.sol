// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../lib/ERC721Mintable.sol";
import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ITokenDescriptor.sol";
import "../interfaces/ICharacter.sol";
// import "../interfaces/IStatus.sol";
// import "../interfaces/IHpRegistory.sol";

contract FROCharacter is ERC721Mintable, Ownable, FROAddressesProxy {
    constructor(address registry_)
        ERC721Mintable("FROCharacter", "FROC")
        FROAddressesProxy(registry_)
    {}

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "nonexistent token");
        return
            ITokenDescriptor(registry.getRegistry("FROTokenDescriptor"))
                .tokenURI(this, tokenId);
    }

    // function mintSetStatus(
    //     address to,
    //     uint256 tokenId,
    //     IStatus.Status calldata status_
    // ) external onlyOwner {
    //     super.mint(to, tokenId);
    //     IStatus(registry.getRegistry("FROStatus")).setStatus(tokenId, status_);
    //     IHpRegistory(registry.getRegistry("FROHpRegistory")).setBattleHp(
    //         tokenId,
    //         status_.hp
    //     );
    // }
}
