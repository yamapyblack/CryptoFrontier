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

  const frontierId = 1;
  const tokenId1 = 1;
  const tokenId2 = 2;
  const tokenId3 = 3;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    c = await deploy();
    c.addresses.setRegistry("FROLogic", owner.address)
    c.character["mint(address[],uint256[])"]([addr1.address,addr1.address,addr1.address], [tokenId1,tokenId2,tokenId3])
  });

  describe("setStake", async () => {
    it("fail", async () => {
      await expect(c.staking.connect(addr1).setStake(tokenId1,addr1.address,frontierId)).reverted
    });
    it("fail approve", async () => {
      await expect(c.staking.connect(addr1).setStake(tokenId1, addr1.address, frontierId)).reverted
    });
    it("success", async () => {
      await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
      await c.staking.setStake(tokenId1, addr1.address, frontierId)
      const expectStake :Stake = {
        frontierId: frontierId,
        staker: addr1.address,
        blockNumber: await getBlockNumber(),
      }
      Expect.stake(await c.staking.getStake(tokenId1), expectStake)
      expect(await c.character.ownerOf(tokenId1)).equals(c.staking.address)
      
    });

  });

  describe("withdrawByLogic", async () => {
    it("fail", async () => {
      await expect(c.staking.connect(addr1).withdrawByLogic(tokenId1)).reverted
    });
    it("fail not staked", async () => {
      await expect(c.staking.withdrawByLogic(tokenId1)).reverted
    });
    it("success", async () => {
      await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
      await c.staking.setStake(tokenId1, addr1.address, frontierId)
      await c.staking.withdrawByOwner(tokenId1)
      const expectStake :Stake = {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      }
      Expect.stake(await c.staking.getStake(tokenId1), expectStake)
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)
    });
  });

  describe("withdrawByOwner", async () => {
    it("fail", async () => {
      await expect(c.staking.connect(addr1).withdrawByOwner(tokenId1)).reverted
    });
    it("success", async () => {
      await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
      await c.staking.setStake(tokenId1, addr1.address, frontierId)
      await c.staking.withdrawByOwner(tokenId1)
      const expectStake :Stake = {
        frontierId: 0,
        staker: NilAddress,
        blockNumber: 0,
      }
      Expect.stake(await c.staking.getStake(tokenId1), expectStake)
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)
    });
});

});
