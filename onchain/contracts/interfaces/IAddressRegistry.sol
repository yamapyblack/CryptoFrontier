// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IAddressRegistry {
    function setRegistry(string memory _key, address _addr) external;
    function getRegistry(string memory _key) external view returns (address);
    function checkRegistory(string memory _key, address _sender) external view;
}
