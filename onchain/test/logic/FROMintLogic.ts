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
      expect(await c.character.ownerOf(tokenId1)).equals(addr1.address)

    });

  });
});
