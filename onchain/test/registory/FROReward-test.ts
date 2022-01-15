import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { BigNumberish, BigNumber, utils } from "ethers";
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

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    c = await deploy();
    c.addresses.setRegistry("FROLogic", owner.address)
    c.character["mint(address[],uint256[])"]([addr1.address,addr1.address,addr1.address], [tokenId1,tokenId2,tokenId3])
    c.token.mintByOwner(c.reward.address, utils.parseEther("10000"))
  });

  describe("setReward", async () => {
    it("success", async () => {
      const reward = utils.parseEther("12")
      await c.reward.setReward(tokenId1, reward)
      expect(await c.reward.rewards(tokenId1)).equals(reward);
    });

    it("success", async () => {
      const reward = utils.parseEther("12")
      await c.reward.setReward(tokenId1, reward)
      await c.reward.setReward(tokenId1, utils.parseEther("15"))
      expect(await c.reward.rewards(tokenId1)).equals(utils.parseEther("15"));
    });

    it("fail", async () => {
      await expect(c.reward.connect(addr1).setReward(1, 1)).reverted
    });
  });

  describe("addReward", async () => {
    it("success", async () => {
      const reward = utils.parseEther("12")
      await c.reward.addReward(tokenId1, reward)
      expect(await c.reward.rewards(tokenId1)).equals(reward);
    });

    it("success", async () => {
      const reward = utils.parseEther("12")
      await c.reward.addReward(tokenId1, reward)
      await c.reward.addReward(tokenId1, utils.parseEther("15"))
      expect(await c.reward.rewards(tokenId1)).equals(utils.parseEther("27"));
    });

    it("fail", async () => {
      await expect(c.reward.connect(addr1).addReward(1, 1)).reverted
    });
  });

  describe("withdrawReward", async () => {
    it("fail", async () => {
      await expect(c.reward.connect(addr2)["withdrawReward(uint256)"](tokenId1)).reverted
    });
    it("success", async () => {
      const reward = utils.parseEther("12")
      await c.reward.addReward(tokenId1, reward)
      await c.reward.connect(addr1)["withdrawReward(uint256)"](tokenId1)
      expect(await c.token.balanceOf(addr1.address)).equals(utils.parseEther("12"))
      expect(await c.reward.rewards(tokenId1)).equals(0)
    });
  });

  describe("withdrawReward 2", async () => {
    it("fail", async () => {
      await expect(c.reward.connect(addr2)["withdrawReward(uint256[])"]([tokenId1])).reverted
    });
    it("success", async () => {
      await c.reward.addReward(tokenId1, utils.parseEther("12"))
      await c.reward.addReward(tokenId2, utils.parseEther("13"))
      await c.reward.connect(addr1)["withdrawReward(uint256[])"]([tokenId1,tokenId2])
      expect(await c.token.balanceOf(addr1.address)).equals(utils.parseEther("25"))
      expect(await c.reward.rewards(tokenId1)).equals(0)
      expect(await c.reward.rewards(tokenId2)).equals(0)
    });
  });

});
