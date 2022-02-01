import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { BigNumberish, BigNumber } from "ethers";
import { expect, use } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { evmMine, getBlockNumber } from "../helper/Mine";
import {
  deploy,
  setup,
  ContractType,
  Util,
  Status,
  Frontier,
  Hp,
  Stake,
  Expect,
  NilAddress,
  InitConstant
} from "../helper/FROHelper";

let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addr3: SignerWithAddress;

describe("testing for JointTest", async () => {
  let c: ContractType;

  const tokenId1 = 1;
  const tokenId2 = 2;
  const tokenId3 = 3;
  let status1: Status = {
    hp: 200,
    at: 100,
    df: 100,
    it: 80,
    sp: 70,
  };
  let status2: Status = {
    hp: 180,
    at: 120,
    df: 120,
    it: 80,
    sp: 70,
  };
  let status3: Status = {
    hp: 180,
    at: 120,
    df: 120,
    it: 80,
    sp: 70,
  };


  const frontierId = 1;

  const initConst: InitConstant = {
    // mintMaxTokenId: 128,
    // maxFrontier: 10,
    epoch: 100,
    reviveEpoch: 100,
    rewardPerBlock: 10000,
  }

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    c = await deploy();
    //TODO weaponとcolor修正
    await setup(c, initConst, [tokenId1, tokenId2, tokenId3], [status1, status2, status3], [1,2,3], [1,2,3]);
  });

  describe("staking", async () => {
    it("staking 1", async () => {
      //claim
      await c.mintLogic!.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);

      //stake
      await c.logic.connect(addr1).stake(tokenId1, frontierId);

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: 0,
        blockNumber: await getBlockNumber(),
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: await getBlockNumber(),
      });
      expect(await c.reward.rewards(tokenId1)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)

      //unStake
      await c.logic.connect(addr1).unStake(tokenId1);

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: 0,
        tokenIdB: 0,
        blockNumber: 0,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)
    });

    it("staking 2", async () => {
      //claim
      await c.mintLogic.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      await c.mintLogic.connect(addr2).claim(tokenId2);
      const block1 = await getBlockNumber()
      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);
      await c.character
        .connect(addr2)
        .setApprovalForAll(c.staking.address, true);

      await c.logic.connect(addr1).stake(tokenId1, frontierId);
      const block2 = await getBlockNumber()
      await c.logic.connect(addr2).stake(tokenId2, frontierId);
      const block3 = await getBlockNumber()

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: tokenId2,
        blockNumber: await getBlockNumber(),
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: status2.hp,
        blockNumber: block1,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.reward.rewards(tokenId2)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)
    });

    it("staking 2 battle", async () => {
      //claim
      await c.mintLogic.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      await c.mintLogic.connect(addr2).claim(tokenId2);
      const block1 = await getBlockNumber()
      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);
      await c.character
        .connect(addr2)
        .setApprovalForAll(c.staking.address, true);

      await c.logic.connect(addr1).stake(tokenId1, frontierId);
      const block2 = await getBlockNumber()
      await c.logic.connect(addr2).stake(tokenId2, frontierId);
      const block3 = await getBlockNumber()

      await evmMine(100);

      // expect battleHp
      let hps = await c.logic.getBothBattleHp(frontierId);
      console.log("hp", hps.hpA.toString(), hps.hpB.toString());
      expect(hps.hpA).equals(Util.calcHp(status1.hp, status2.at, status1.df, 100, Number(initConst.epoch)));
      expect(hps.hpB).equals(Util.calcHp(status2.hp, status1.at, status2.df, 100, Number(initConst.epoch)));

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: tokenId2,
        blockNumber: block3,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: status2.hp,
        blockNumber: block1,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.reward.rewards(tokenId2)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)

      // unStake fail while battle
      await expect(c.logic.connect(addr1).unStake(tokenId1)).revertedWith(
        "cannnot unstake while battle"
      );
    });

    it("staking 2, A is dead", async () => {
      //claim
      await c.mintLogic.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      await c.mintLogic.connect(addr2).claim(tokenId2);
      const block1 = await getBlockNumber()
      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);
      await c.character
        .connect(addr2)
        .setApprovalForAll(c.staking.address, true);

      await c.logic.connect(addr1).stake(tokenId1, frontierId);
      const block2 = await getBlockNumber()
      await c.logic.connect(addr2).stake(tokenId2, frontierId);
      const block3 = await getBlockNumber()

      await evmMine(300);

      let hps = await c.logic.getBothBattleHp(frontierId);
      console.log("hp", hps.hpA.toString(), hps.hpB.toString());
      expect(hps.hpA).equals(0);
      expect(hps.hpB).equals(
        Util.calcHp(status2.hp, status1.at, status2.df, hps.deadBlock.toNumber() - block3, Number(initConst.epoch))
      );

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: tokenId2,
        blockNumber: block3,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: status2.hp,
        blockNumber: block1,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.reward.rewards(tokenId2)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)

      //unstake
      await c.logic.connect(addr1).unStake(tokenId1);
      const block4 = await getBlockNumber()

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: 0,
        tokenIdB: tokenId2,
        blockNumber: block4,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: hps.hpA,
        blockNumber: await getBlockNumber(),
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: hps.hpB,
        blockNumber: await getBlockNumber(),
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      // deadBlock - stakingBlock
      expect(await c.reward.rewards(tokenId1)).equals(Number(initConst.rewardPerBlock) * (Number(hps.deadBlock) - block2));
      expect(await c.reward.rewards(tokenId2)).equals(Number(initConst.rewardPerBlock) * (block4 - block3));
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)
    });

    it("staking 2, both dead(in fact A was dead)", async () => {
      //claim
      await c.mintLogic.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      await c.mintLogic.connect(addr2).claim(tokenId2);
      const block1 = await getBlockNumber()

      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);
      await c.character
        .connect(addr2)
        .setApprovalForAll(c.staking.address, true);

      await c.logic.connect(addr1).stake(tokenId1, frontierId);
      const block2 = await getBlockNumber()
      await c.logic.connect(addr2).stake(tokenId2, frontierId);
      const block3 = await getBlockNumber()

      await evmMine(500);

      let hps = await c.logic.getBothBattleHp(frontierId);
      console.log("hp", hps.hpA.toString(), hps.hpB.toString());
      console.log("yama", block3, Number(hps.deadBlock))
      expect(hps.hpA).equals(0);
      expect(hps.hpB).equals(
        Util.calcHp(status2.hp, status1.at, status2.df, hps.deadBlock.toNumber() - block3, Number(initConst.epoch))
      );

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: tokenId2,
        blockNumber: block3,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: status2.hp,
        blockNumber: block1,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.reward.rewards(tokenId2)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)

      //unstake
      await c.logic.connect(addr1).unStake(tokenId1);
      const block4 = await getBlockNumber()

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: 0,
        tokenIdB: tokenId2,
        blockNumber: block4,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: hps.hpA,
        blockNumber: await getBlockNumber(),
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: hps.hpB,
        blockNumber: await getBlockNumber(),
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      // deadBlock - stakingBlock
      expect(await c.reward.rewards(tokenId1)).equals(Number(initConst.rewardPerBlock) * (Number(hps.deadBlock) - block2));
      expect(await c.reward.rewards(tokenId2)).equals(Number(initConst.rewardPerBlock) * (block4 - block3));
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)
    });

    //TODO
    it("staking 2, A was dead and re-stake", async () => {
      //claim
      await c.mintLogic.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      await c.mintLogic.connect(addr2).claim(tokenId2);
      const block1 = await getBlockNumber()

      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);
      await c.character
        .connect(addr2)
        .setApprovalForAll(c.staking.address, true);

      await c.logic.connect(addr1).stake(tokenId1, frontierId);
      const block2 = await getBlockNumber()
      await c.logic.connect(addr2).stake(tokenId2, frontierId);
      const block3 = await getBlockNumber()

      await evmMine(500);

      let hps = await c.logic.getBothBattleHp(frontierId);
      console.log("hp", hps.hpA.toString(), hps.hpB.toString());
      console.log("yama", block3, Number(hps.deadBlock))
      expect(hps.hpA).equals(0);
      expect(hps.hpB).equals(
        Util.calcHp(status2.hp, status1.at, status2.df, hps.deadBlock.toNumber() - block3, Number(initConst.epoch))
      );

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: tokenId2,
        blockNumber: block3,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: status2.hp,
        blockNumber: block1,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.reward.rewards(tokenId2)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)

      //re-stake
      await c.mintLogic.connect(addr3).claim(tokenId3);
      await c.character
        .connect(addr3)
        .setApprovalForAll(c.staking.address, true);
      await c.logic.connect(addr3).stake(tokenId3, frontierId);
      const block4 = await getBlockNumber()

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId3,
        tokenIdB: tokenId2,
        blockNumber: block4,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: hps.hpA,
        blockNumber: await getBlockNumber(),
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: hps.hpB,
        blockNumber: await getBlockNumber(),
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      // deadBlock - stakingBlock
      expect(await c.reward.rewards(tokenId1)).equals(Number(initConst.rewardPerBlock) * (Number(hps.deadBlock) - block2));
      expect(await c.reward.rewards(tokenId2)).equals(Number(initConst.rewardPerBlock) * (block4 - block3));
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)
    });

    it("staking 2, B is dead", async () => {
      status1 = {
        hp: 500,
        at: 200,
        df: 100,
        it: 80,
        sp: 70,
      };    
      await c.status.setStatusByOwner([tokenId1], [status1], [1], [1])

      //claim
      await c.mintLogic.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      await c.mintLogic.connect(addr2).claim(tokenId2);
      const block1 = await getBlockNumber()
      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);
      await c.character
        .connect(addr2)
        .setApprovalForAll(c.staking.address, true);

      await c.logic.connect(addr1).stake(tokenId1, frontierId);
      const block2 = await getBlockNumber()
      await c.logic.connect(addr2).stake(tokenId2, frontierId);
      const block3 = await getBlockNumber()

      await evmMine(300);

      let hps = await c.logic.getBothBattleHp(frontierId);
      console.log("hp", hps.hpA.toString(), hps.hpB.toString());

      expect(hps.hpA).equals(
        Util.calcHp(status1.hp, status2.at, status1.df, Number(hps.deadBlock) - block3, Number(initConst.epoch))
      );
      expect(hps.hpB).equals(0);

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: tokenId2,
        blockNumber: block3,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: status2.hp,
        blockNumber: block1,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.reward.rewards(tokenId2)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)

      //unstake
      await c.logic.connect(addr2).unStake(tokenId2);
      const block4 = await getBlockNumber()

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: 0,
        blockNumber: block4,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: hps.hpA,
        blockNumber: await getBlockNumber(),
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: hps.hpB,
        blockNumber: await getBlockNumber(),
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      });
      // deadBlock - stakingBlock
      expect(await c.reward.rewards(tokenId1)).equals(Number(initConst.rewardPerBlock) * (block4 - block2));
      expect(await c.reward.rewards(tokenId2)).equals(Number(initConst.rewardPerBlock) * (Number(hps.deadBlock) - block3));
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(addr2.address)
    });

    it("both are dead at same time", async () => {
      status1 = {
        hp: 400,
        at: 200,
        df: 200,
        it: 80,
        sp: 70,
      };    
      let status2: Status = {
        hp: 300,
        at: 300,
        df: 100,
        it: 80,
        sp: 70,
      };
      await c.status.setStatusByOwner([tokenId1,tokenId2], [status1, status2], [1,2], [1,2])

      //claim
      await c.mintLogic.connect(addr1).claim(tokenId1);
      const block0 = await getBlockNumber()
      await c.mintLogic.connect(addr2).claim(tokenId2);
      const block1 = await getBlockNumber()

      //approve
      await c.character
        .connect(addr1)
        .setApprovalForAll(c.staking.address, true);
      await c.character
        .connect(addr2)
        .setApprovalForAll(c.staking.address, true);

      await c.logic.connect(addr1).stake(tokenId1, frontierId);
      const block2 = await getBlockNumber()
      await c.logic.connect(addr2).stake(tokenId2, frontierId);
      const block3 = await getBlockNumber()

      await evmMine(500);

      let hps = await c.logic.getBothBattleHp(frontierId);
      console.log("hp", hps.hpA.toString(), hps.hpB.toString());
      expect(hps.hpA).equals(0)
      expect(hps.hpB).equals(0)

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: tokenId1,
        tokenIdB: tokenId2,
        blockNumber: block3,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: status1.hp,
        blockNumber: block0,
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: status2.hp,
        blockNumber: block1,
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: block2,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: frontierId,
        staker: addr2.address,
        blockNumber: block3,
      });
      expect(await c.reward.rewards(tokenId1)).equals(initConst.rewardPerBlock);
      expect(await c.reward.rewards(tokenId2)).equals(0);
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      expect(await c.character.ownerOf(tokenId2)).equals(c.staking.address)

      //unstake
      await c.logic.connect(addr1).unStake(tokenId1);
      const block4 = await getBlockNumber()

      //expect
      Expect.frontier(await c.frontier.getFrontier(frontierId), {
        tokenIdA: 0,
        tokenIdB: 0,
        blockNumber: 0,
      });
      Expect.hp(await c.hp.getHp(tokenId1), {
        hp: hps.hpA,
        blockNumber: await getBlockNumber(),
      });
      Expect.hp(await c.hp.getHp(tokenId2), {
        hp: hps.hpB,
        blockNumber: await getBlockNumber(),
      });
      Expect.stake(await c.staking.getStake(tokenId1), {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      });
      Expect.stake(await c.staking.getStake(tokenId2), {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      });
      // deadBlock - stakingBlock
      expect(await c.reward.rewards(tokenId1)).equals(Number(initConst.rewardPerBlock) * (Number(hps.deadBlock) - block2));
      expect(await c.reward.rewards(tokenId2)).equals(Number(initConst.rewardPerBlock) * (Number(hps.deadBlock) - block3));
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)
      expect(await c.character.ownerOf(tokenId2)).equals(addr2.address)

    });

  });
});
