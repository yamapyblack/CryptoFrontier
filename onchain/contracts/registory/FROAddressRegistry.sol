// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IAddressRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../lib/EnumerableMapEx.sol";

contract FROAddressRegistry is IAddressRegistry, Ownable {
    using EnumerableMapEx for EnumerableMapEx.Bytes32ToAddressMap;

    // mapping(bytes32 => EnumerableMap.AddressSet) private registries;

    EnumerableMapEx.Bytes32ToAddressMap private registries;

    function setRegistry(string memory _key, address _addr)
        external
        override
        onlyOwner
    {
        bytes32 key = keccak256(abi.encodePacked(_key));
        registries.set(key, _addr);
        // registries[key] = _addr;
    }

    function getRegistry(string memory _key)
        external
        view
        override
        returns (address)
    {
        bytes32 key = keccak256(abi.encodePacked(_key));
        // return registries[key];
        return registries.get(key);
    }

    function checkRegistory(string memory _key, address _sender) external view override {
        bytes32 key = keccak256(abi.encodePacked(_key));
        // if (registries[key] == _sender) {
        if (registries.get(key) == _sender) {
            return;
        }
        revert("AddressRegistry: onlyRegister error");
    }
}
