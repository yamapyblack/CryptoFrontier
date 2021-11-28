// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IReward {
    function rewards(uint256 _tokenId) external view returns(uint);
    function setReward(uint256 _tokenId, uint _reward) external;
    function addReward(uint _tokenId, uint _addReward) external;
    function withdrawReward(uint _tokenId) external;
}
