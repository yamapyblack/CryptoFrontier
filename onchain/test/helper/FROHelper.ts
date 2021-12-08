import { ethers } from 'hardhat'
import { BigNumberish, BigNumber } from 'ethers'
import { expect, use } from "chai";

import { FROAddresses } from "typechain/FROAddresses"
// import { FROAddressesProxy } from "typechain/FROAddressesProxy"
import { FROFrontier } from "typechain/FROFrontier"
import { FROStatus } from "typechain/FROStatus"
import { FROHp } from "typechain/FROHp"
import { FROTokenDescriptor } from "typechain/FROTokenDescriptor"
import { FROCharacter } from "typechain/FROCharacter"
import { FROReward } from "typechain/FROReward"
import { FROStaking } from "typechain/FROStaking"
import { FROToken } from "typechain/FROToken"
import { FROLogic } from "typechain/FROLogic"
import { FROMintLogic } from "typechain/FROMintLogic"

export const NilAddress = "0x0000000000000000000000000000000000000000"

export type ContractType = {
  addresses: FROAddresses
  // addreseProxy: FROAddressesProxy
  frontier: FROFrontier
  status: FROStatus
  hp: FROHp
  descriptor: FROTokenDescriptor
  character: FROCharacter
  reward: FROReward
  staking: FROStaking
  token: FROToken
  logic: FROLogic
  mintLogic: FROMintLogic
}

export type Status = {
  hp: BigNumberish
  at: BigNumberish
  df: BigNumberish
  it: BigNumberish
  sp: BigNumberish
}

export type Frontier = {
  tokenIdA: BigNumberish
  tokenIdB: BigNumberish
  blockNumber: BigNumberish
}

export type Hp = {
  hp: BigNumberish
  blockNumber: BigNumberish
}

export type Stake = {
  frontierId: BigNumberish
  staker: string
  blockNumber: BigNumberish
}

export const deploy = async (): Promise<ContractType> => {
  let addresses: FROAddresses
  // let addreseProxy: FROAddressesProxy
  let frontier: FROFrontier
  let status: FROStatus
  let hp: FROHp
  let descriptor: FROTokenDescriptor
  let character: FROCharacter
  let reward: FROReward
  let staking: FROStaking
  let token: FROToken
  let logic: FROLogic
  let mintLogic: FROMintLogic

  const FROAddresses = await ethers.getContractFactory("FROAddresses");
  addresses = (await FROAddresses.deploy()) as FROAddresses
  await addresses.deployed()

  const FROFrontier = await ethers.getContractFactory("FROFrontier");
  frontier = (await FROFrontier.deploy(addresses.address)) as FROFrontier
  await frontier.deployed()

  const FROStatus = await ethers.getContractFactory("FROStatus");
  status = (await FROStatus.deploy(addresses.address)) as FROStatus
  await status.deployed()

  const FROHp = await ethers.getContractFactory("FROHp");
  hp = (await FROHp.deploy(addresses.address)) as FROHp
  await hp.deployed()

  const FROTokenDescriptor = await ethers.getContractFactory("FROTokenDescriptor");
  descriptor = (await FROTokenDescriptor.deploy(addresses.address)) as FROTokenDescriptor
  await descriptor.deployed()

  const FROCharacter = await ethers.getContractFactory("FROCharacter");
  character = (await FROCharacter.deploy(addresses.address)) as FROCharacter
  await character.deployed()

  const FROReward = await ethers.getContractFactory("FROReward");
  reward = (await FROReward.deploy(addresses.address)) as FROReward
  await reward.deployed()

  const FROStaking = await ethers.getContractFactory("FROStaking");
  staking = (await FROStaking.deploy(addresses.address)) as FROStaking
  await staking.deployed()

  const FROToken = await ethers.getContractFactory("FROToken");
  token = (await FROToken.deploy(addresses.address)) as FROToken
  await token.deployed()

  const FROLogic = await ethers.getContractFactory("FROLogic");
  logic = (await FROLogic.deploy(addresses.address)) as FROLogic
  await logic.deployed()

  const FROMintLogic = await ethers.getContractFactory("FROMintLogic");
  mintLogic = (await FROMintLogic.deploy(addresses.address)) as FROMintLogic
  await mintLogic.deployed()

  const c: ContractType = {
    addresses: addresses,
    frontier: frontier,
    status: status,
    hp: hp,
    descriptor: descriptor,
    character: character,
    reward: reward,
    staking: staking,
    token: token,
    logic: logic,
    mintLogic: mintLogic
  }

  await c.addresses.setRegistry("FROFrontier", c.frontier.address)
  await c.addresses.setRegistry("FROStatus", c.status.address)
  await c.addresses.setRegistry("FROHp", c.hp.address)
  await c.addresses.setRegistry("FROTokenDescriptor", c.descriptor.address)
  await c.addresses.setRegistry("FROCharacter", c.character.address)
  await c.addresses.setRegistry("FROReward", c.reward.address)
  await c.addresses.setRegistry("FROStaking", c.staking.address)
  await c.addresses.setRegistry("FROToken", c.token.address)
  await c.addresses.setRegistry("FROLogic", c.logic.address)
  await c.addresses.setRegistry("FROMintLogic", c.mintLogic.address)

  return c
}

export const setup = async (c: ContractType, tokenIds: number[], status: Status[]): Promise<void> => {
  if(tokenIds.length != status.length){
    console.error("tokenIds.length != status.length")
    return  
  }

  for(let i = 0; i < tokenIds.length;  i++){
    await c.status.setStatus(tokenIds[i],status[i])
    await c.status.setStatus(tokenIds[i],status[i])
  }

  const MINTER_ROLE = await c.character.MINTER_ROLE()
  await c.character.grantRole(MINTER_ROLE, c.mintLogic.address)
  await c.mintLogic.setMaxRange(initConst.mintRange)
  await c.frontier.setMaxFrontier(initConst.maxFrontier)
  await c.logic.setEpoch(initConst.epoch)
  await c.logic.setReviveEpoch(initConst.reviveEpoch)
  await c.logic.setRewardPerBlock(initConst.rewardPerBlock)
}

export class Expect {
  static frontier = (_expect: [BigNumber,BigNumber,BigNumber], _actual: Frontier) => {
    expect(_expect[0]).equals(_actual.tokenIdA);
    expect(_expect[1]).equals(_actual.tokenIdB);
    expect(_expect[2]).equals(_actual.blockNumber);
  }
  
  static hp = (_expect: [BigNumber,BigNumber], _actual: Hp) => {
      expect(_expect[0]).equals(_actual.hp);
      expect(_expect[1]).equals(_actual.blockNumber);
  };
  
  static stake = (_expect: [BigNumber,string,BigNumber], _actual: Stake) => {
      expect(_expect[0]).equals(_actual.frontierId);
      expect(_expect[1]).equals(_actual.staker);
      expect(_expect[2]).equals(_actual.blockNumber);
  };
  
}

export class Util {
  static calcHp = (initHp: BigNumberish, enemyAt: BigNumberish, df: BigNumberish, epoch: number = 1): BigNumberish => {
    return Number(initHp) - ((Number(enemyAt) - Number(df)/2) * epoch)
  }  
}

export const initConst = {
  epoch: 100,
  mintRange: 100,
  maxFrontier: 10,
  reviveEpoch: 100,
  rewardPerBlock: 10000,
}