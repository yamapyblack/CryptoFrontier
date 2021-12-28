// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "../lib/ERC721Permit.sol";

contract ERC721PermitMock is ERC721Permit {
    constructor() ERC721("ERC721PermitMock", "ERC721PermitMock") {}

    function mint(address to, uint tokenId) external {
        _mint(to,tokenId);
    }

    function permitMock(
        address owner,
        address spender,
        uint256 tokenId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external pure returns (bool) {
        bytes32 structHash = encodeData(owner, spender, tokenId, deadline);

        address signer = ECDSA.recover(ECDSA.toEthSignedMessageHash(structHash), v, r, s);
        return (owner == signer);
    }

    // function permitMock2(
    //     address owner,
    //     address spender,
    //     uint256 tokenId,
    //     uint256 deadline,
    //     bytes memory sign
    // ) external view returns (bool) {
    //     bytes32 structHash = encodeData(owner, spender, tokenId, deadline);

    //     address signer = ECDSA.recover(ECDSA.toEthSignedMessageHash(structHash), sign);
    //     return (owner == signer);
    // }

    function encodeData(
        address owner,
        address spender,
        uint256 tokenId,
        uint256 deadline
    ) public pure returns (bytes32) {
        return keccak256(
            abi.encode(owner, spender, tokenId, 0, deadline)
        );
    }

    // function encodeData(
    //     address owner,
    //     address spender,
    //     uint256 tokenId
    // ) public pure returns (bytes32) {
    //     return keccak256(
    //         abi.encode(owner, spender, tokenId)
    //     );
    // }

}
