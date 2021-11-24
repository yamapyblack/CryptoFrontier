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
    uint constant REWARD_PER_BLOCK = 10000;

    // mapping(tokenId => amount)
    mapping(uint => uint) rewards;

    // mapping(tokenID => Stake)
    mapping(uint => IFrontier.Stake) tokenStaked;

    // mapping(frontierID => tokenID)
    mapping(uint256 => IFrontier.Frontier) frontiers;

    constructor(address registory_) FROAddressProxy(registory_) {}

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
        //TODO event

        uint hp = IStatus(registry.getRegistry("FROStatus")).getStatus(tokenId).hp;

        IFrontier.Frontier storage f = frontiers[frontierId];
        f.blockNumber = block.number; //set blockNumber
 
        // neither A nor B
        if(f.tokenIdA == 0 && f.tokenIdB == 0){
            f.tokenIdA = tokenId;
            f.tokenIdAHp = hp;

        // only A
        }else if(f.tokenIdA > 0 && f.tokenIdB == 0){
            _reward(f.tokenIdA, f.blockNumber);
            f.tokenIdB = tokenId;
            f.tokenIdBHp = hp;

        // only B
        }else if(f.tokenIdA == 0 && f.tokenIdB > 0){
            _reward(f.tokenIdB, f.blockNumber);
            f.tokenIdA = tokenId;
            f.tokenIdAHp = hp;
            
        // both A and B
        }else{
            (uint hpA, uint hpB, uint deadBlock) = getHp(frontierId);
            // both live
            if(hpA > 0 && hpB > 0){
                revert("both alive");

            // A is dead
            }else if(hpA == 0 && hpB > 0){
                _reward(f.tokenIdA, deadBlock);
                _reward(f.tokenIdB, f.blockNumber);
                f.tokenIdA = tokenId;
                f.tokenIdAHp = hp;

            // B is dead
            }else if(hpA > 0 && hpB == 0){
                _reward(f.tokenIdA, f.blockNumber);
                _reward(f.tokenIdB, deadBlock);
                f.tokenIdB = tokenId;
                f.tokenIdBHp = hp;

            // both dead
            }else{
                _reward(f.tokenIdA, deadBlock);
                _reward(f.tokenIdB, deadBlock);
                f.tokenIdA = tokenId;
                f.tokenIdAHp = hp;
            }
        }
    }

    function _reward(uint tokenId, uint fromBlockNumber) internal {
        uint reward = (block.number - fromBlockNumber) * REWARD_PER_BLOCK;
        rewards[tokenId] += reward;
    }

    function getHp(uint frontierId) public view returns(uint hpA, uint hpB, uint deadBlock) {
        IFrontier.Frontier memory f = frontiers[frontierId];

        // neither A nor B
        if(f.tokenIdA == 0 && f.tokenIdB == 0){
            hpA = 0;
            hpB = 0;
            deadBlock = 0;

        // only A
        }else if(f.tokenIdA > 0 && f.tokenIdB == 0){
            hpA = f.tokenIdAHp;
            hpB = 0;
            deadBlock = 0;

        // only B
        }else if(f.tokenIdA == 0 && f.tokenIdB > 0){
            hpA = 0;
            hpB = f.tokenIdBHp;
            deadBlock = 0;
            
        // both A and B
        }else{
            uint blockNumbers = block.number - f.blockNumber;
    
            IStatus.Status memory statusA = IStatus(registry.getRegistry("FROStatus")).getStatus(f.tokenIdA);
            IStatus.Status memory statusB = IStatus(registry.getRegistry("FROStatus")).getStatus(f.tokenIdB);

            uint damegeA = _calcDamage(blockNumbers, statusB.at, statusA.df);
            uint damegeB = _calcDamage(blockNumbers, statusA.at, statusB.df);
            bool isADead = (f.tokenIdAHp < damegeA);
            bool isBDead = (f.tokenIdBHp < damegeB);

            // both live
            if(!isADead && !isBDead){
                hpA = f.tokenIdAHp - damegeA;
                hpB = f.tokenIdBHp - damegeB;
                deadBlock = 0;

            // A is dead
            }else if(isADead && !isBDead){
                hpA = 0;
                hpB = f.tokenIdBHp - damegeB;
                deadBlock = _calcDeadBlock(f.tokenIdAHp, statusB.at, statusA.df);

            // B is dead
            }else if(!isADead && isBDead){
                hpA = f.tokenIdAHp - damegeA;
                hpB = 0;
                deadBlock = _calcDeadBlock(f.tokenIdAHp, statusB.at, statusA.df);

            // both dead
            }else{
                uint deadABlock = _calcDeadBlock(f.tokenIdAHp, statusB.at, statusA.df);
                uint deadBBlock = _calcDeadBlock(f.tokenIdBHp, statusA.at, statusB.df);

                //A is dead
                if(deadABlock < deadBBlock){
                    blockNumbers = deadABlock - f.blockNumber;
                    hpA = 0;
                    hpB = f.tokenIdBHp - _calcDamage(blockNumbers, statusA.at, statusB.df);
                    deadBlock = deadABlock;

                //B is dead
                }else if(deadABlock > deadBBlock){
                    blockNumbers = deadBBlock - f.blockNumber;
                    hpA = f.tokenIdAHp - _calcDamage(blockNumbers, statusB.at, statusA.df);
                    hpB = 0;
                    deadBlock = deadBBlock;

                //draw
                }else{
                    hpA = 0;
                    hpB = 0;
                    deadBlock = deadABlock;
                }

            }
        }
    }

    function _calcDamage(uint blockNumbers, uint at, uint df) view internal returns(uint) {
        //TODO per EPOCH calc
        return (at - (df / 2)) * blockNumbers / EPOCH;
    }

    function _calcDeadBlock(uint hp, uint at, uint df) view internal returns(uint) {
        return hp * EPOCH / (at - (df / 2));
    }

    function revive(uint tokenId) override external {
        // TODO staker check
        require(tokenStaked[tokenId].blockNumber > 0, "this token is not staked");

        IFrontier.Stake memory s = tokenStaked[tokenId];
        IFrontier.Frontier storage f = frontiers[s.frontierId];

        delete tokenStaked[tokenId];
        //TODO transfer token

        // without frontier
        if(f.tokenIdA != tokenId && f.tokenIdB != tokenId){
            return;
        }

        (uint hpA, uint hpB, uint deadBlock) = getHp(s.frontierId);

        // both A and B
        if(hpA > 0 && hpB > 0){
            revert("cannnot unstake white battle");
        }

        bool isTokenA = f.tokenIdA == tokenId;
        if(isTokenA){
            // dead A
            if(hpA == 0){
                _reward(tokenId, block.number - deadBlock);                

            // alive A
            }else{
                _reward(tokenId, block.number - f.blockNumber);
            }
            f.tokenIdA = 0;
            f.tokenIdAHp = 0;

        }else{
            // dead B
            if(hpB == 0){
                _reward(tokenId, block.number - deadBlock);                

            // alive B
            }else{
                _reward(tokenId, block.number - f.blockNumber);
            }
            f.tokenIdB = 0;
            f.tokenIdBHp = 0;
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
        // IToken(registry.getRegistry("FROToken")).mint(msg.sender, rewardNow + reward);
    }

}
