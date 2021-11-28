// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IHp {
    struct Hp {
        uint hp;
        uint blockNumber;
    }
    function getHp(uint256 _tokenId) external view returns(Hp memory);
    function setHp(uint256 _tokenId, uint _hp) external;
    function reduceHp(uint256 _tokenId, uint _hpDiff) external returns(uint);
}
