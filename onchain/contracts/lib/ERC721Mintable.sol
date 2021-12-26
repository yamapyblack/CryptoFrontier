// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "../interfaces/IERC721Mintable.sol";

abstract contract ERC721Mintable is IERC721Mintable, ERC721 {

    uint256 public override totalSupply = 0;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function exists(uint256 _tokenId) external override view returns (bool) {
        return super._exists(_tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            totalSupply++;
        }
    }

}
