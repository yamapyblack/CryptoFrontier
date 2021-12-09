// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract MathTest{
    function calc1() external view returns(uint){
        uint a = 1;
        uint b = 2;
        return a/b;
    }

    function calc2() external view returns(uint){
        uint a = 1;
        uint b = 3;
        return a/b;
    }

    function calc3() external view returns(uint){
        uint a = 2;
        uint b = 3;
        return a/b;
    }
}
