// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../interfaces/IStaking.sol";
import "../interfaces/ICharacter.sol";
import "../address/FROAddressesProxy.sol";
import "../lib/ERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FROStaking is IStaking, FROAddressesProxy, Ownable, ERC721Receiver {

    constructor(address registory_) FROAddressesProxy(registory_) {}

    // mapping(tokenId => Stake)
    mapping(uint256 => IStaking.Stake) private tokenStaked;

    function getStake(uint256 _tokenId)
        external
        view
        override
        returns (IStaking.Stake memory)
    {
        return tokenStaked[_tokenId];
    }

    function setStake(
        uint256 _tokenId,
        address _sender,
        uint256 _frontierId
    ) external override {
        registry.checkRegistory("FROLogic", msg.sender);
        require(
            ICharacter(registry.getRegistry("FROCharacter")).isApprovedForAll(
                _sender,
                address(this)
            ),
            "FROStaking: is not approved"
        );

        ICharacter(registry.getRegistry("FROCharacter")).safeTransferFrom(
            _sender,
            address(this),
            _tokenId
        );
        _setStake(_tokenId, _sender, _frontierId);
    }

    function _setStake(
        uint256 _tokenId,
        address _sender,
        uint256 _frontierId
    ) internal {
        tokenStaked[_tokenId] = IStaking.Stake(
            _frontierId,
            _sender,
            block.number
        );
    }

    // function withdrawByStaker(uint256 _tokenId) external override {
    //     require(
    //         tokenStaked[_tokenId].staker == msg.sender,
    //         "FROStaking: sender is not staker"
    //     );
    //     _withdraw(_tokenId);
    // }

    function withdrawByLogic(uint256 _tokenId) external override {
        registry.checkRegistory("FROLogic", msg.sender);
        _withdraw(_tokenId);
    }

    function withdrawByOwner(uint256 _tokenId) external override onlyOwner {
        _withdraw(_tokenId);
    }

    function _withdraw(uint256 _tokenId) internal {

        address staker = tokenStaked[_tokenId].staker;

        ICharacter(registry.getRegistry("FROCharacter")).transferFrom(
            address(this),
            staker,
            _tokenId
        );
        delete tokenStaked[_tokenId];
    }
}
