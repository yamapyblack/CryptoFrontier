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

    uint256 constant maticHour = 60 * 60 / 2;

    uint256 public epoch = maticHour * 3; //3h
    uint256 public rewardPerBlock = 1000 * (10 ** 18) / (maticHour * 6); //6hで1000
    uint256 public reviveEpoch = maticHour * 6; //6h

    constructor(address registory_) FROAddressesProxy(registory_) {}

    function _reward(uint256 tokenId, uint256 blockNumbers) internal {
        uint256 reward = blockNumbers * rewardPerBlock;
        IReward(registry.getRegistry("FROReward")).addReward(tokenId, reward);
    }

    function _clearFrontier(uint256 _frontierId) internal {
        IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
            _frontierId,
            IFrontier.Frontier(0, 0, 0)
        );
    }

    function setEpoch(uint256 _epoch) external onlyOwner {
        epoch = _epoch;
    }

    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        rewardPerBlock = _rewardPerBlock;
    }

    function setReviveEpoch(uint256 _reviveEpoch) external onlyOwner {
        reviveEpoch = _reviveEpoch;
    }

    function _calcDeadBlock(
        uint256 hp,
        uint256 at,
        uint256 df
    ) internal view returns (uint256) {
        return (hp * epoch) / (at - (df / 2));
    }

    function _calcDamage(
        uint256 blockNumbers,
        uint256 at,
        uint256 df
    ) internal view returns (uint256) {
        return ((at - (df / 2)) * blockNumbers) / epoch;
    }

    function _getBattleHp(
        uint256 blockNumbers,
        uint256 playerHp,
        uint256 enemyAt,
        uint256 playerDf
    ) private view returns (uint256 hp, uint256 deadBlockNums) {
        if (playerHp > _calcDamage(blockNumbers, enemyAt, playerDf)) {
            hp = playerHp - _calcDamage(blockNumbers, enemyAt, playerDf);
            deadBlockNums = 0;
        } else {
            hp = 0;
            deadBlockNums = _calcDeadBlock(playerHp, enemyAt, playerDf);
        }
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

            uint256 tokenAHp = IHp(registry.getRegistry("FROHp"))
                .getHp(f.tokenIdA)
                .hp;
            uint256 tokenBHp = IHp(registry.getRegistry("FROHp"))
                .getHp(f.tokenIdB)
                .hp;

            (uint256 battleHpA, uint256 deadBlockNumsA) = _getBattleHp(
                blockNumbers,
                tokenAHp,
                statusB.at,
                statusA.df
            );
            (uint256 battleHpB, uint256 deadBlockNumsB) = _getBattleHp(
                blockNumbers,
                tokenBHp,
                statusA.at,
                statusB.df
            );

            (bool isDeadA, bool isDeadB) = (false, false);

            // both live
            if (battleHpA > 0 && battleHpB > 0) {
                // A is dead
            } else if (battleHpA == 0 && battleHpB > 0) {
                (isDeadA, isDeadB) = (true, false);

                // B is dead
            } else if (battleHpA > 0 && battleHpB == 0) {
                (isDeadA, isDeadB) = (false, true);

                // both dead
            } else {
                //A is dead
                if (deadBlockNumsA < deadBlockNumsB) {
                    (isDeadA, isDeadB) = (true, false);

                    //B is dead
                } else if (deadBlockNumsA > deadBlockNumsB) {
                    (isDeadA, isDeadB) = (false, true);

                    //draw
                } else {
                    (isDeadA, isDeadB) = (true, true);
                }
            }

            if (!isDeadA && !isDeadB) {
                hpA = battleHpA;
                hpB = battleHpB;
                deadBlock = 0;

            } else if (isDeadA && !isDeadB) {
                hpA = 0;
                (hpB, ) = _getBattleHp(
                    deadBlockNumsA,
                    tokenBHp,
                    statusA.at,
                    statusB.df
                );
                deadBlock = deadBlockNumsA + f.blockNumber;

            } else if (!isDeadA && isDeadB) {
                (hpA, ) = _getBattleHp(
                    deadBlockNumsB,
                    tokenAHp,
                    statusB.at,
                    statusA.df
                );
                hpB = 0;
                deadBlock = deadBlockNumsB + f.blockNumber;

            } else {
                hpA = 0;
                hpB = 0;
                deadBlock = deadBlockNumsA + f.blockNumber;
            }
        }
    }

    function stake(uint256 tokenId, uint256 frontierId) external override {
        require(
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(tokenId) ==
                msg.sender,
            "sender is not owner of tokenId"
        );

        //setStaked
        IStaking(registry.getRegistry("FROStaking")).setStake(
            tokenId,
            msg.sender,
            frontierId
        );

        IFrontier.Frontier memory f = IFrontier(
            registry.getRegistry("FROFrontier")
        ).getFrontier(frontierId);

        // neither A nor B
        if (f.tokenIdA == 0 && f.tokenIdB == 0) {
            f.tokenIdA = tokenId;

            // only A
        } else if (f.tokenIdA > 0 && f.tokenIdB == 0) {
            _reward(f.tokenIdA, block.number - f.blockNumber);
            f.tokenIdB = tokenId;

            // only B
        } else if (f.tokenIdA == 0 && f.tokenIdB > 0) {
            _reward(f.tokenIdB, block.number - f.blockNumber);
            f.tokenIdA = tokenId;

            // both A and B
        } else {
            (uint256 hpA, uint256 hpB, uint256 deadBlock) = getBattleHp(
                frontierId
            );

            // both alive
            if (hpA > 0 && hpB > 0) {
                revert("both alive");

                // A is dead
            } else if (hpA == 0 && hpB > 0) {
                _reward(f.tokenIdA, deadBlock - f.blockNumber);
                _reward(f.tokenIdB, block.number - f.blockNumber);
                f.tokenIdA = tokenId;

                // B is dead
            } else if (hpA > 0 && hpB == 0) {
                _reward(f.tokenIdA, block.number - f.blockNumber);
                _reward(f.tokenIdB, deadBlock - f.blockNumber);
                f.tokenIdB = tokenId;

                // both dead
            } else {
                _reward(f.tokenIdA, deadBlock - f.blockNumber);
                _reward(f.tokenIdB, deadBlock - f.blockNumber);
                f.tokenIdA = tokenId;
            }

            //setHP
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdA, hpA);
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdB, hpB);
        }

        //set frontier
        f.blockNumber = block.number;
        IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
            frontierId,
            f
        );
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

        // neither A nor B
        // none of case

        // only A
        // only B
        if (
            (f.tokenIdA > 0 && f.tokenIdB == 0) ||
            (f.tokenIdA == 0 && f.tokenIdB > 0)
        ) {
            _reward(tokenId, block.number - f.blockNumber);
            _clearFrontier(s.frontierId);

            // both A and B
        } else {
            (uint256 hpA, uint256 hpB, uint256 deadBlock) = getBattleHp(
                s.frontierId
            );

            // both alive
            if (hpA > 0 && hpB > 0) {
                revert("cannnot unstake while battle");

                // A is dead
            } else if (hpA == 0 && hpB > 0) {
                _reward(f.tokenIdA, deadBlock - f.blockNumber);
                _reward(f.tokenIdB, block.number - f.blockNumber);

                // your token is A
                if (f.tokenIdA == tokenId) {
                    IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
                        s.frontierId,
                        IFrontier.Frontier(0, f.tokenIdB, block.number)
                    );
                } else {
                    _clearFrontier(s.frontierId);
                }

                // B is dead
            } else if (hpA > 0 && hpB == 0) {
                _reward(f.tokenIdA, block.number - f.blockNumber);
                _reward(f.tokenIdB, deadBlock - f.blockNumber);

                // your token is A
                if (f.tokenIdA == tokenId) {
                    _clearFrontier(s.frontierId);
                } else {
                    IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
                        s.frontierId,
                        IFrontier.Frontier(f.tokenIdA, 0, block.number)
                    );
                }

                // both daed
            } else {
                _reward(f.tokenIdA, deadBlock - f.blockNumber);
                _reward(f.tokenIdB, deadBlock - f.blockNumber);
                _clearFrontier(s.frontierId);
            }
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdA, hpA);
            IHp(registry.getRegistry("FROHp")).setHp(f.tokenIdB, hpB);
        }
    }

    function revive(uint256 tokenId) external override {
        require(
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(tokenId) ==
                msg.sender,
            "sender is not owner of tokenId"
        );

        IHp.Hp memory hp = IHp(registry.getRegistry("FROHp")).getHp(tokenId);
        require(hp.hp == 0, "not hp 0 or staking now");
        require(
            block.number > hp.blockNumber + reviveEpoch,
            "must be past reviveEpoch"
        );

        IHp(registry.getRegistry("FROHp")).setHp(
            tokenId,
            IStatus(registry.getRegistry("FROStatus")).getStatus(tokenId).hp
        );
    }
}
