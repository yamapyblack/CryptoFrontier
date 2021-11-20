// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IStatus {
    struct Status {
        uint hp;
        uint at;
        uint mg;
        uint df;
        uint sp;
    }

    function getStatus(uint256 tokenId) 
        external
        view
        returns (IStatus.Status memory);

    function setStatus(uint256 tokenId, IStatus.Status calldata status_) external;

}
