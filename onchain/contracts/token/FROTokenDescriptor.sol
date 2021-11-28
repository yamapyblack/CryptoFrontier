// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "../interfaces/ITokenDescriptor.sol";
import "../interfaces/IStatus.sol";

contract FROTokenDescriptor is ITokenDescriptor, FROAddressesProxy {
    using Strings for uint256;

    constructor(address registry_) FROAddressesProxy(registry_) {}

    function generateName(uint256 tokenId)
        private
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "CryptoFrontier Character #",
                    tokenId.toString()
                )
            );
    }

    function generateDescription(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return string(abi.encodePacked("Lets battle!!"));
    }

    function generateAttributes(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        IStatus.Status memory status = IStatus(
            registry.getRegistry("FROStatus")
        ).getStatus(tokenId);

        string[5] memory trait_types = ["hp", "at", "df", "it", "sp"];
        uint256[5] memory values = [
            status.hp,
            status.at,
            status.df,
            status.it,
            status.sp
        ];

        return buildAttributes(trait_types, values);
    }

    function buildAttributes(
        string[5] memory trait_types,
        uint256[5] memory values
    ) private view returns (string memory) {
        require(trait_types.length == values.length, "length must be same");

        string memory ret = "[";
        for (uint8 i = 0; i < values.length; i++) {
            ret = string(
                abi.encodePacked(
                    ret,
                    '{"trait_type": "',
                    trait_types[i],
                    '","value": "',
                    values[i].toString(),
                    '"}'
                )
            );
        }

        ret = string(abi.encodePacked(ret, "]"));
        return ret;
    }

    function generateImage(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        string memory name = "test #";

        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
                    "<style>.textClass { fill: #000; font-size: 48px; text-anchor: middle;}</style>",
                    '<rect width="100%" height="100%" fill="#ddd" />',
                    '<text x="175" y="180" class="textClass">',
                    name,
                    tokenId.toString(),
                    "</text>",
                    "</svg>"
                )
            );
    }

    function tokenURI(IERC721 token, uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                generateName(tokenId),
                                '", "description":"',
                                generateDescription(tokenId),
                                '", "attributes":"',
                                generateAttributes(tokenId),
                                '", "image": "data:image/svg+xml;base64,',
                                generateImage(tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
