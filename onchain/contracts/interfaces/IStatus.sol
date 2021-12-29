// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IStatus {
    struct Status {
        uint256 hp;
        uint256 at;
        uint256 df;
        uint256 it;
        uint256 sp;
    }

    function getStatus(uint256 tokenId)
        external
        view
        returns (IStatus.Status memory);

    // function setStatus(uint256 tokenId, IStatus.Status calldata status_) external;
    function setStatusByOwner(uint[] calldata _tokenIds, IStatus.Status[] calldata _status, uint8[] calldata _weapons, uint8[] calldata _colors) external;
    function color(uint256 _tokenId) external view returns(uint8);
    function weapon(uint256 _tokenId) external view returns(uint8);
}
