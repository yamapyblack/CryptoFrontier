// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITokenDescriptor {
    function tokenURI(IERC721 token, uint256 tokenId)
        external
        view
        returns (string memory);
}
