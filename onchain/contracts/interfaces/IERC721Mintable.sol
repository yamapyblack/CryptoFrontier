// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC721Mintable {
    function exists(uint256 _tokenId) external view returns (bool);
    function mint(address _to, uint256 _tokenId) external;
    function totalSupply() external returns (uint256);
}

