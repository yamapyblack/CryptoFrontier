// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721Mintable is IERC721{
    function exists(uint256 _tokenId) external view returns (bool);
    function totalSupply() external returns (uint256);
}

