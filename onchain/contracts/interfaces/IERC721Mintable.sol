// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721Mintable is IERC721{
    function exists(uint256 _tokenId) external view returns (bool);
    function mint(address _to, uint256 _tokenId) external;
    function mint(address[] memory _toList, uint256[] memory _tokenIdList) external;
    function totalSupply() external returns (uint256);
}

