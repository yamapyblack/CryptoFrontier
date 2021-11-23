// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../lib/FROAddressProxy.sol";
import "../lib/ERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../interfaces/IFrontier.sol";
import "../interfaces/IToken.sol";
import "../interfaces/IStatus.sol";
import "../interfaces/ICharacter.sol";

contract FROFrontier is Ownable, FROAddressProxy, IFrontier, ERC721Receiver {
    // TODO separate contract into logic and storage

    uint constant EPOCH = 60 * 60 * 6 / 2; //6h polygon

    // mapping(tokenId => amount)
    mapping(uint => uint) rewards;

    // mapping(tokenID => Stake)
    mapping(uint => IFrontier.Stake) tokenStaked;

    // mapping(frontierID => tokenID)
    mapping(uint256 => IFrontier.Frontier) private frontiers;

    constructor(address registry_) FROAddressProxy(registry_) {}

    function getFrontier(uint256 tokenId)
        override
        external
        view
        returns (IFrontier.Frontier memory)
    {
        return frontiers[tokenId];
    }

    function stake(uint tokenId, uint frontierId) override external {
        ICharacter character = ICharacter(registry.getRegistry("FROCharacter"));

        require(
            character.ownerOf(tokenId) == msg.sender,
            "sender is not owner of tokenId"
        );

        //TODO approve check
        character.safeTransferFrom(msg.sender, address(this), tokenId);

        //setStaked
        tokenStaked[tokenId] = IFrontier.Stake(frontierId, msg.sender, block.number);

        IFrontier.Frontier memory f = frontiers[frontierId];

        uint hp = IStatus(registry.getRegistry("FROStatus")).getStatus(tokenId).hp;

        if(f.tokenIdA > 0 && f.tokenIdB > 0){
            // TODO if there is already token, starting battle


        }else if(f.tokenIdA == 0 && f.tokenIdB > 0){
            frontiers[frontierId] = IFrontier.Frontier(tokenId, hp, f.tokenIdB, f.tokenIdBHp, block.number);

        }else if(f.tokenIdA > 0 && f.tokenIdB == 0){
            frontiers[frontierId] = IFrontier.Frontier(f.tokenIdA, f.tokenIdAHp, tokenId, hp, block.number);
            
        }else{
            //nobody staking
            frontiers[frontierId] = IFrontier.Frontier(tokenId, hp, 0, 0, block.number);

            //TODO event
        }

    }

    function unStake(uint frontierId) override external {
        // ICharacter character = ICharacter(registry.getRegistry("FROCharacter"));
        // IFrontier.Frontier memory f = frontiers[frontierId];

        // require(
        //     f.staker == msg.sender,
        //     "sender is not staker"
        // );

        // //TODO sum reword

        // uint reward = 0;
        // uint rewardNow = _calcReward(block.number - f.blockNumber);
        // IToken(registry.getRegistry("FROToken")).mint(msg.sender, rewardNow + reward);
    }

    function _calcReward(uint number) private returns(uint) {
        return number * 100;
    }

    function revive(uint256 tokenId) override external {
        //TODO
    }

    function _checkHp(uint tokenId) private returns(uint) {
        

    }

    function getHp(uint frontierId) public view returns(uint hpA, uint deadABlock, uint hpB, uint deadBBlock) {
        uint blockNumbers = block.number - frontiers[frontierId].blockNumber;

        //TODO test
        
        IStatus.Status memory statusA = IStatus.Status(200,100,100,80,60);
        IStatus.Status memory statusB = IStatus.Status(200,120,80,80,60);

        //TODO per EPOCH calc

        uint damegeA = _calcDamage(blockNumbers, statusB.at, statusA.df);
        uint damegeB = _calcDamage(blockNumbers, statusA.at, statusB.df);

        bool isADead = (statusA.hp < damegeA);
        bool isBDead = (statusB.hp < damegeB);

        if(!isADead && !isBDead){
            hpA = statusA.hp - damegeA;
            deadABlock = 0;
            hpB = statusB.hp - damegeB;
            deadBBlock = 0;

        }else if(isADead && !isBDead){
            hpA = 0;
            deadABlock = _calcDeadBlock(statusA.hp, statusB.at, statusA.df);
            hpB = statusB.hp - damegeB;
            deadBBlock = 0;

        }else if(!isADead && isBDead){
            hpA = statusA.hp - damegeA;
            deadABlock = 0;
            hpB = 0;
            deadBBlock = _calcDeadBlock(statusA.hp, statusB.at, statusA.df);

        }else{
            hpA = 0;
            deadABlock = _calcDeadBlock(statusA.hp, statusB.at, statusA.df);
            hpB = 0;
            deadBBlock = _calcDeadBlock(statusA.hp, statusB.at, statusA.df);
        }

    }

    function _calcDamage(uint blockNumbers, uint at, uint df) view private returns(uint) {
        return (at - (df / 2)) * blockNumbers / EPOCH;
    }

    function _calcDeadBlock(uint hp, uint at, uint df) view private returns(uint) {
        return hp * EPOCH / (at - (df / 2));
    }
}
