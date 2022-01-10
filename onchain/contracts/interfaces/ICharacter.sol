// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../interfaces/IERC721Mintable.sol";

interface ICharacter is IERC721Mintable {
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function mintByLogic(address to, uint256 tokenId) external;
}
