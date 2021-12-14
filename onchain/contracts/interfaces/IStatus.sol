// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IStatus {
    struct Status {
        uint hp;
        uint at;
        uint df;
        uint it;
        uint sp;
    }

    function getStatus(uint256 tokenId) 
        external
        view
        returns (IStatus.Status memory);

    // function setStatus(uint256 tokenId, IStatus.Status calldata status_) external;
    function setStatusByOwner(uint[] calldata _tokenIds, IStatus.Status[] calldata _status) external;

}
