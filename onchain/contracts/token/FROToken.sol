// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../address/FROAddressesProxy.sol";
import "../interfaces/IToken.sol";

contract FROToken is ERC20, Ownable, FROAddressesProxy, IToken {
    constructor(address registry_)
        FROAddressesProxy(registry_)
        ERC20("FrontierToken", "FRO")
    {}

    function mintByOwner(address account, uint256 amount) override external onlyOwner {
        _mint(account, amount);
    }

    function mint(address account, uint256 amount) override external onlyAddress("FROReward") {
        _mint(account, amount);
    }

}
