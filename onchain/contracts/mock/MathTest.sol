// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract MathTest{
    function calc1() external pure returns(uint){
        uint a = 1;
        uint b = 2;
        return a/b;
    }

    function calc2() external pure returns(uint){
        uint a = 1;
        uint b = 3;
        return a/b;
    }

    function calc3() external pure returns(uint){
        uint a = 2;
        uint b = 3;
        return a/b;
    }
}
