// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IStaking {
    struct Stake {
        uint frontierId;
        address staker;
        uint blockNumber;
    }
    function getStake(uint256 _tokenId) external view returns(Stake memory);
    function setStake(uint256 _tokenId, address _sender, uint _frontierId) external;
    function withdraw(uint256 _tokenId, address _sender) external;
    function withdrawByOwner(uint256 _tokenId) external;
}
