// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "hardhat/console.sol";

contract FutureHashTest{

    function getHash() external view returns(bytes32) {
        uint blockNumber = block.number - 1;
        console.log("FutureHashTest: ", blockNumber);
        return blockhash(block.number - 1);
    }

}
