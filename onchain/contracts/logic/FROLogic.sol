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
    uint public epoch = 100;
    uint public rewardPerBlock = 10000;
    uint public reviveEpoch = 100;

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
        //TODO per EPOCH calc
        return ((at - (df / 2)) * blockNumbers) / epoch;
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
                deadBlock =
                    _calcDeadBlock(tokenAHp, statusB.at, statusA.df) +
                    f.blockNumber;

                // B is dead
            } else if (!isADead && isBDead) {
                console.log("FROLogic: B is dead");
                hpA = tokenAHp - damegeA;
                hpB = 0;
                deadBlock =
                    _calcDeadBlock(tokenBHp, statusA.at, statusB.df) +
                    f.blockNumber;

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

    function setEpoch(uint256 _epoch) external onlyOwner {
        epoch = _epoch;
    }

    function setRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        rewardPerBlock = _rewardPerBlock;
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
            } else if (hpA == 0) {
                _reward(f.tokenIdA, deadBlock - f.blockNumber);
                _reward(f.tokenIdB, block.number - f.blockNumber);

                // your is token A
                if (f.tokenIdA == tokenId) {
                    IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
                        s.frontierId,
                        IFrontier.Frontier(0, f.tokenIdB, block.timestamp)
                    );
                } else {
                    _clearFrontier(s.frontierId);
                }

                // B is dead
            } else if (hpB == 0) {
                _reward(f.tokenIdA, block.number - f.blockNumber);
                _reward(f.tokenIdB, deadBlock - f.blockNumber);

                // your is token A
                if (f.tokenIdA == tokenId) {
                    _clearFrontier(s.frontierId);
                } else {
                    IFrontier(registry.getRegistry("FROFrontier")).setFrontier(
                        s.frontierId,
                        IFrontier.Frontier(f.tokenIdA, 0, block.timestamp)
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

    function revive(uint tokenId) external override {
        require(
            ICharacter(registry.getRegistry("FROCharacter")).ownerOf(tokenId) ==
                msg.sender,
            "sender is not owner of tokenId"
        );

        IHp.Hp memory hp = IHp(registry.getRegistry("FROHp")).getHp(tokenId);
        require(hp.hp == 0, "not hp 0 or staking now");
        require(block.number > hp.blockNumber + reviveEpoch, "must be past reviveEpoch");

        IHp(registry.getRegistry("FROHp")).setHp(tokenId, IStatus(registry.getRegistry("FROStatus")).getStatus(tokenId).hp);
    }
}
