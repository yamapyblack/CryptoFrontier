// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "../address/FROAddressesProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/ILogic.sol";
import "../interfaces/IToken.sol";
import "../interfaces/IStatus.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IHp.sol";
import "../interfaces/ICharacter.sol";
import "../interfaces/IReward.sol";
import "../interfaces/IFrontier.sol";

contract FROLogic is Ownable, FROAddressesProxy, ILogic {

    uint public epoch = 60 * 60 * 6 / 2; //6h polygon
    uint public rewardPerBlock = 10000;

    constructor(address registory_) FROAddressesProxy(registory_) {}

    function setEpoch(uint _epoch) external onlyOwner{
        epoch = _epoch;
    }
    function setRewardPerBlock(uint _rewardPerBlock) external onlyOwner{
        rewardPerBlock = _rewardPerBlock;
    }

    function stake(uint tokenId, uint frontierId) override external {
        ICharacter character = ICharacter(registry.getRegistry("FROCharacter"));

        require(
            character.ownerOf(tokenId) == msg.sender,
            "sender is not owner of tokenId"
        );

        //setStaked
        IStaking(registry.getRegistry("FROStaking")).setStake(tokenId, msg.sender, frontierId);
        //TODO event

        IFrontier.Frontier memory f = IFrontier(registry.getRegistry("FROFrontier")).getFrontier(frontierId);
        f.blockNumber = block.number; //set blockNumber
 
        // neither A nor B
        if(f.tokenIdA == 0 && f.tokenIdB == 0){
            f.tokenIdA = tokenId;

        // only A
        }else if(f.tokenIdA > 0 && f.tokenIdB == 0){
            _reward(f.tokenIdA, block.number);
            f.tokenIdB = tokenId;

        // only B
        }else if(f.tokenIdA == 0 && f.tokenIdB > 0){
            _reward(f.tokenIdB, block.number);
            f.tokenIdA = tokenId;
            
        // both A and B
        }else{
            (uint hpA, uint hpB, uint deadBlock) = getBattleHp(frontierId);

            // both live
            if(hpA > 0 && hpB > 0){
                revert("both alive");

            // A is dead
            }else if(hpA == 0 && hpB > 0){
                _reward(f.tokenIdA, deadBlock);
                _reward(f.tokenIdB, block.number);
                f.tokenIdA = tokenId;

            // B is dead
            }else if(hpA > 0 && hpB == 0){
                _reward(f.tokenIdA, block.number);
                _reward(f.tokenIdB, deadBlock);
                f.tokenIdB = tokenId;

            // both dead
            }else{
                _reward(f.tokenIdA, deadBlock);
                _reward(f.tokenIdB, deadBlock);
                f.tokenIdA = tokenId;
            }

            //setHP
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdA, hpA);
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdB, hpB);
        }

        //set frontier
        IFrontier(registry.getRegistry("FROFrontier")).setFrontier(frontierId, f);
    }

    function _reward(uint tokenId, uint fromBlockNumber) internal {
        uint reward = (block.number - fromBlockNumber) * rewardPerBlock;
        IReward(registry.getRegistry("FROReward")).addReward(tokenId, reward);
    }

    function getBattleHp(uint frontierId) public view returns(uint hpA, uint hpB, uint deadBlock) {
        IFrontier.Frontier memory f = IFrontier(registry.getRegistry("FROFrontier")).getFrontier(frontierId);

        // neither A nor B
        if(f.tokenIdA == 0 && f.tokenIdB == 0){
            hpA = 0;
            hpB = 0;
            deadBlock = 0;

        // only A
        }else if(f.tokenIdA > 0 && f.tokenIdB == 0){
            hpA = IHp(registry.getRegistry("FROHp")).getHp(f.tokenIdA).hp;
            hpB = 0;
            deadBlock = 0;

        // only B
        }else if(f.tokenIdA == 0 && f.tokenIdB > 0){
            hpA = 0;
            hpB = IHp(registry.getRegistry("FROHp")).getHp(f.tokenIdB).hp;
            deadBlock = 0;
            
        // both A and B
        }else{
            uint blockNumbers = block.number - f.blockNumber;
    
            IStatus.Status memory statusA = IStatus(registry.getRegistry("FROStatus")).getStatus(f.tokenIdA);
            IStatus.Status memory statusB = IStatus(registry.getRegistry("FROStatus")).getStatus(f.tokenIdB);

            uint damegeA = _calcDamage(blockNumbers, statusB.at, statusA.df);
            uint damegeB = _calcDamage(blockNumbers, statusA.at, statusB.df);

            uint tokenAHp = IHp(registry.getRegistry("FROHp")).getHp(f.tokenIdA).hp;
            uint tokenBHp = IHp(registry.getRegistry("FROHp")).getHp(f.tokenIdB).hp;

            bool isADead = (tokenAHp < damegeA);
            bool isBDead = (tokenBHp < damegeB);

            // both live
            if(!isADead && !isBDead){
                hpA = tokenAHp - damegeA;
                hpB = tokenBHp - damegeB;
                deadBlock = 0;

            // A is dead
            }else if(isADead && !isBDead){
                hpA = 0;
                hpB = tokenBHp - damegeB;
                deadBlock = _calcDeadBlock(tokenAHp, statusB.at, statusA.df);

            // B is dead
            }else if(!isADead && isBDead){
                hpA = tokenAHp - damegeA;
                hpB = 0;
                deadBlock = _calcDeadBlock(tokenBHp, statusA.at, statusB.df);

            // both dead
            }else{
                uint deadABlock = _calcDeadBlock(tokenAHp, statusB.at, statusA.df);
                uint deadBBlock = _calcDeadBlock(tokenBHp, statusA.at, statusB.df);

                //A is dead
                if(deadABlock < deadBBlock){
                    blockNumbers = deadABlock - f.blockNumber;
                    hpA = 0;
                    hpB = tokenBHp - _calcDamage(blockNumbers, statusA.at, statusB.df);
                    deadBlock = deadABlock;

                //B is dead
                }else if(deadABlock > deadBBlock){
                    blockNumbers = deadBBlock - f.blockNumber;
                    hpA = tokenAHp - _calcDamage(blockNumbers, statusB.at, statusA.df);
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
        return (at - (df / 2)) * blockNumbers / epoch;
    }

    function _calcDeadBlock(uint hp, uint at, uint df) view internal returns(uint) {
        return hp * epoch / (at - (df / 2));
    }

    function revive(uint tokenId) override external {
        //TODO deside revive epoch

        IStaking.Stake memory s = IStaking(registry.getRegistry("FROStaking")).getStake(tokenId);
        IStaking(registry.getRegistry("FROStaking")).withdraw(tokenId, msg.sender);

        IFrontier.Frontier memory f = IFrontier(registry.getRegistry("FROFrontier")).getFrontier(s.frontierId);

        // without frontier
        if(f.tokenIdA != tokenId && f.tokenIdB != tokenId){
            return;
        }

        (uint hpA, uint hpB, uint deadBlock) = getBattleHp(s.frontierId);

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
            IHp(registry.getRegistry("FROHp")).setHp(tokenId, hpA);

        }else{
            // dead B
            if(hpB == 0){
                _reward(tokenId, block.number - deadBlock);                

            // alive B
            }else{
                _reward(tokenId, block.number - f.blockNumber);
            }
            f.tokenIdB = 0;
            IHp(registry.getRegistry("FROHp")).setHp(tokenId, hpB);
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
