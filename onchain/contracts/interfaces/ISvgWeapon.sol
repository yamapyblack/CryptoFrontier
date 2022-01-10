// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

interface ISvgWeapon {
    function weaponName(uint8 weapon)
        external
        view
        returns (string memory);

    function weaponSvg(uint8 weapon)
        external
        view
        returns (string memory);
}
