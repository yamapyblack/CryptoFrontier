// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "../logic/FROLogic.sol";

contract LogicMock is FROLogic {

    constructor() FROLogic(address(0)) {}

    function calcDamage(uint blockNumbers, uint at, uint df) view external returns(uint) {
        return _calcDamage(blockNumbers, at, df);
    }    

}
