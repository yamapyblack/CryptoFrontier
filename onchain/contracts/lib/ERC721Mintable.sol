// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "../interfaces/IERC721Mintable.sol";

abstract contract ERC721Mintable is IERC721Mintable, ERC721, AccessControlEnumerable {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public override totalSupply = 0;

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
		_setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
		_setupRole(MINTER_ROLE, _msgSender());
    }

    function exists(uint256 _tokenId) external override view returns (bool) {
        return super._exists(_tokenId);
    }

    function mint(address to, uint256 tokenId)
        public
        virtual
        override
        onlyRole(MINTER_ROLE)
    {
        super._mint(to, tokenId);
    }

    function mint(address[] memory _toList, uint256[] memory _tokenIdList) external
    {
        require(
            _toList.length == _tokenIdList.length,
            "input length must be same"
        );
        for (uint256 i = 0; i < _tokenIdList.length; i++) {
            mint(_toList[i], _tokenIdList[i]);
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, IERC165)
        returns (bool)
    {
        return
            AccessControlEnumerable.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId);
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
