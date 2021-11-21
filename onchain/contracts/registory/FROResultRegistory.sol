// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../interfaces/IResultRegistory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FROResultRegistory is IResultRegistory, Ownable {

    uint public battleId;

    // mapping(battleId => Result)
    mapping(uint256 => Result) public result;

    constructor() {
        battleId = 0;
    }

    function setResult(IResultRegistory.Result memory _result) external override onlyOwner 
        returns(uint)
    {
        battleId++;
        result[battleId] = _result;
        return battleId;
    }

}
