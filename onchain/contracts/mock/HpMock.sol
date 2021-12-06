// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "hardhat/console.sol";

import "../registory/FROHp.sol";

contract HpMock is FROHp {

    constructor(address registory_) FROHp(registory_) {}

    function setHpMock(uint256 _tokenId, uint256 _hp) external {
        _setHp(_tokenId, _hp);
    }

}
