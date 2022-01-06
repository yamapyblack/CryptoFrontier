// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IERC721Permit {
    function permit(address owner, address spender, uint256 tokenId, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
    function nonces(address owner) external view returns (uint256);
}

abstract contract ERC721Permit is ERC721, IERC721Permit {
    using Counters for Counters.Counter;

    mapping (address => Counters.Counter) private _nonces;

    function permit(address owner, address spender, uint256 tokenId, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public virtual override {

        address tokenOwner = ownerOf(tokenId);
        require(spender != tokenOwner, "ERC721Permit: approval to current owner");
        require(tokenOwner == owner || isApprovedForAll(tokenOwner, owner),
            "ERC721Permit: approve signer is not owner nor approved for all"
        );

        // solhint-disable-next-line not-rely-on-time
        require(block.timestamp <= deadline, "ERC721Permit: expired deadline");

        bytes32 structHash = keccak256(
            abi.encode(
                owner,
                spender,
                tokenId,
                _nonces[owner].current(),
                deadline
            )
        );

        address signer = ECDSA.recover(ECDSA.toEthSignedMessageHash(structHash), v, r, s);
        require(signer == owner, "ERC721Permit: invalid signature");

        _nonces[owner].increment();
        super._approve(spender, tokenId);
    }

    function nonces(address owner) public view override returns (uint256) {
        return _nonces[owner].current();
    }
}

