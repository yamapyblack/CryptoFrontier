// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IToken is IERC20 {
    function mintByOwner(address account, uint256 amount) external;
    function mint(address account, uint256 amount) external;
}
