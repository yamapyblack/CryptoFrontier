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
import "hardhat/console.sol";

contract FROLogic is Ownable, FROAddressesProxy, ILogic {
    // uint public epoch = 60 * 60 * 6 / 2; //6h polygon
    uint256 public epoch = 100;
    uint256 public rewardPerBlock = 10000;

    constructor(address registory_) FROAddressesProxy(registory_) {}

    function setEpoch(uint256 _epoch) external onlyOwner {
        epoch = _epoch;
    }

    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        rewardPerBlock = _rewardPerBlock;
    }

    function stake(uint256 tokenId, uint256 frontierId) external override {
        ICharacter character = ICharacter(registry.getRegistry("FROCharacter"));

        require(
            character.ownerOf(tokenId) == msg.sender,
            "sender is not owner of tokenId"
        );

        //setStaked
        IStaking(registry.getRegistry("FROStaking")).setStake(
            tokenId,
            msg.sender,
            frontierId
        );
        //TODO event

        IFrontier.Frontier memory f = IFrontier(
            registry.getRegistry("FROFrontier")
        ).getFrontier(frontierId);
        f.blockNumber = block.number; //set blockNumber

        // neither A nor B
        if (f.tokenIdA == 0 && f.tokenIdB == 0) {
            f.tokenIdA = tokenId;

            // only A
        } else if (f.tokenIdA > 0 && f.tokenIdB == 0) {
            _reward(f.tokenIdA, block.number);
            f.tokenIdB = tokenId;

            // only B
        } else if (f.tokenIdA == 0 && f.tokenIdB > 0) {
            _reward(f.tokenIdB, block.number);
            f.tokenIdA = tokenId;

            // both A and B
        } else {
            (uint256 hpA, uint256 hpB, uint256 deadBlock) = getBattleHp(
                frontierId
            );

            // both live
            if (hpA > 0 && hpB > 0) {
                revert("both alive");

                // A is dead
            } else if (hpA == 0 && hpB > 0) {
                _reward(f.tokenIdA, deadBlock);
                _reward(f.tokenIdB, block.number);
                f.tokenIdA = tokenId;

                // B is dead
            } else if (hpA > 0 && hpB == 0) {
                _reward(f.tokenIdA, block.number);
                _reward(f.tokenIdB, deadBlock);
                f.tokenIdB = tokenId;

                // both dead
            } else {
                _reward(f.tokenIdA, deadBlock);
                _reward(f.tokenIdB, deadBlock);
                f.tokenIdA = tokenId;
            }

            //setHP
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdA, hpA);
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdB, hpB);
        }

        //set frontier
        IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
            frontierId,
            f
        );
    }

    function _reward(uint256 tokenId, uint256 fromBlockNumber) internal {
        uint256 reward = (block.number - fromBlockNumber) * rewardPerBlock;
        IReward(registry.getRegistry("FROReward")).addReward(tokenId, reward);
    }

    function getBattleHp(uint256 frontierId)
        public
        view
        returns (
            uint256 hpA,
            uint256 hpB,
            uint256 deadBlock
        )
    {
        IFrontier.Frontier memory f = IFrontier(
            registry.getRegistry("FROFrontier")
        ).getFrontier(frontierId);

        // neither A nor B
        if (f.tokenIdA == 0 && f.tokenIdB == 0) {
            console.log("FROLogic: neither A nor B");
            hpA = 0;
            hpB = 0;
            deadBlock = 0;

            // only A
        } else if (f.tokenIdA > 0 && f.tokenIdB == 0) {
            console.log("FROLogic: only A");
            hpA = IHp(registry.getRegistry("FROHp")).getHp(f.tokenIdA).hp;
            hpB = 0;
            deadBlock = 0;

            // only B
        } else if (f.tokenIdA == 0 && f.tokenIdB > 0) {
            console.log("FROLogic: only B");
            hpA = 0;
            hpB = IHp(registry.getRegistry("FROHp")).getHp(f.tokenIdB).hp;
            deadBlock = 0;

            // both A and B
        } else {
            console.log("FROLogic: both A and B");
            uint256 blockNumbers = block.number - f.blockNumber;

            IStatus.Status memory statusA = IStatus(
                registry.getRegistry("FROStatus")
            ).getStatus(f.tokenIdA);
            IStatus.Status memory statusB = IStatus(
                registry.getRegistry("FROStatus")
            ).getStatus(f.tokenIdB);

            uint256 damegeA = _calcDamage(blockNumbers, statusB.at, statusA.df);
            uint256 damegeB = _calcDamage(blockNumbers, statusA.at, statusB.df);
            console.log("FROLogic: damage", damegeA, damegeB);

            uint256 tokenAHp = IHp(registry.getRegistry("FROHp"))
                .getHp(f.tokenIdA)
                .hp;
            uint256 tokenBHp = IHp(registry.getRegistry("FROHp"))
                .getHp(f.tokenIdB)
                .hp;

            bool isADead = (tokenAHp < damegeA);
            bool isBDead = (tokenBHp < damegeB);

            // both live
            if (!isADead && !isBDead) {
                console.log("FROLogic: both live");
                hpA = tokenAHp - damegeA;
                hpB = tokenBHp - damegeB;
                deadBlock = 0;

                // A is dead
            } else if (isADead && !isBDead) {
                console.log("FROLogic: A is dead");
                hpA = 0;
                hpB = tokenBHp - damegeB;
                deadBlock = _calcDeadBlock(tokenAHp, statusB.at, statusA.df);

                // B is dead
            } else if (!isADead && isBDead) {
                console.log("FROLogic: B is dead");
                hpA = tokenAHp - damegeA;
                hpB = 0;
                deadBlock = _calcDeadBlock(tokenBHp, statusA.at, statusB.df);

                // both dead
            } else {
                console.log("FROLogic: both dead");
                uint256 deadABlock = _calcDeadBlock(
                    tokenAHp,
                    statusB.at,
                    statusA.df
                ) + f.blockNumber;
                uint256 deadBBlock = _calcDeadBlock(
                    tokenBHp,
                    statusA.at,
                    statusB.df
                ) + f.blockNumber;

                console.log(
                    "FROLogic: deadBlock",
                    deadABlock,
                    deadBBlock,
                    f.blockNumber
                );

                //A is dead
                if (deadABlock < deadBBlock) {
                    blockNumbers = deadABlock - f.blockNumber;
                    hpA = 0;
                    hpB =
                        tokenBHp -
                        _calcDamage(blockNumbers, statusA.at, statusB.df);
                    deadBlock = deadABlock;

                    //B is dead
                } else if (deadABlock > deadBBlock) {
                    blockNumbers = deadBBlock - f.blockNumber;
                    hpA =
                        tokenAHp -
                        _calcDamage(blockNumbers, statusB.at, statusA.df);
                    hpB = 0;
                    deadBlock = deadBBlock;

                    //draw
                } else {
                    hpA = 0;
                    hpB = 0;
                    deadBlock = deadABlock;
                }
            }
        }
    }

    function _calcDamage(
        uint256 blockNumbers,
        uint256 at,
        uint256 df
    ) internal view returns (uint256) {
        //TODO per EPOCH calc
        return ((at - (df / 2)) * blockNumbers) / epoch;
    }

    function _calcDeadBlock(
        uint256 hp,
        uint256 at,
        uint256 df
    ) internal view returns (uint256) {
        return (hp * epoch) / (at - (df / 2));
    }

    function unStake(uint256 tokenId) external override {

        IStaking.Stake memory s = IStaking(registry.getRegistry("FROStaking"))
            .getStake(tokenId);
        IStaking(registry.getRegistry("FROStaking")).withdraw(
            tokenId,
            msg.sender
        );

        IFrontier.Frontier memory f = IFrontier(
            registry.getRegistry("FROFrontier")
        ).getFrontier(s.frontierId);

        // without frontier
        if (f.tokenIdA != tokenId && f.tokenIdB != tokenId) {
            return;
        }

        bool isOnlyA = (f.tokenIdA > 0 && f.tokenIdB == 0);
        bool isOnlyB = (f.tokenIdA == 0 && f.tokenIdB > 0);
        //only A or only B
        if (isOnlyA || isOnlyB) {
            IFrontier.Frontier memory f_ = IFrontier.Frontier(0, 0, 0);
            IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
                s.frontierId,
                f_
            );

        // both A and B
        } else {
            (uint256 hpA, uint256 hpB, uint256 deadBlock) = getBattleHp(
                s.frontierId
            );

            // both alive
            if (hpA > 0 && hpB > 0) {
                revert("cannnot unstake while battle");
            }

            bool isTokenA = f.tokenIdA == tokenId;
            if (isTokenA) {
                console.log("FROLogic: isTokenA");
                // dead A
                if (hpA == 0) {
                    _reward(tokenId, block.number - deadBlock);

                // alive A
                } else {
                    _reward(tokenId, block.number - f.blockNumber);
                }
                IHp(registry.getRegistry("FROHp")).setHp(tokenId, hpA);
                IFrontier.Frontier memory f_ = IFrontier.Frontier(
                    0,
                    f.tokenIdB,
                    block.timestamp
                );
                IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
                    s.frontierId,
                    f_
                );

            } else {
                console.log("isTokenB");
                // dead B
                if (hpB == 0) {
                    _reward(tokenId, block.number - deadBlock);

                // alive B
                } else {
                    _reward(tokenId, block.number - f.blockNumber);
                }
                IHp(registry.getRegistry("FROHp")).setHp(tokenId, hpB);
                IFrontier.Frontier memory f_ = IFrontier.Frontier(
                    f.tokenIdA,
                    0,
                    block.timestamp
                );
                IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
                    s.frontierId,
                    f_
                );
            }
        }
    }

    function revive(uint256 tokenId) external override {
        //TODO deside revive epoch

    }
}
