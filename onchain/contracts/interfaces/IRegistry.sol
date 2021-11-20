// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IRegistry {
    function setRegistry(string memory _key, address _addr) external;
    function getRegistry(string memory _key) external view returns (address);
}
