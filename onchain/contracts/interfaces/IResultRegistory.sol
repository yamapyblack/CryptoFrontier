// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IResultRegistory {
    struct Result {
        address winner;
        address loser;
        uint256 winnerTokenId;
        uint256 loserTokenId;
        uint256 endBlock;
    }

    function setResult(IResultRegistory.Result memory _result)
        external
        returns (uint256);
}
