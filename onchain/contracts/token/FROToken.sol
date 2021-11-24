// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../lib/FROAddressProxy.sol";
import "../interfaces/IToken.sol";

contract FROToken is ERC20, Ownable, FROAddressProxy, IToken {
    constructor(address registry_)
        FROAddressProxy(registry_)
        ERC20("FrontierToken", "FRO")
    {}

    function mintByOwner(address account, uint256 amount) override external onlyOwner {
        _mint(account, amount);
    }

    function mint(address account, uint256 amount) override external onlyAddress("FROFrontier") {
        _mint(account, amount);
    }

}
