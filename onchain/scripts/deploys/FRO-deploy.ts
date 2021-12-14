import { ethers } from 'hardhat'
import { Signer, BigNumberish } from 'ethers'
import { Addresses, KmsSigner, Verify, AddressesType } from "../common"

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
  
const deploy = async (signer: Signer): Promise<ContractType> => {
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
    addresses = (await FROAddresses.connect(signer).deploy()) as FROAddresses
    await addresses.deployed()
  
    const FROFrontier = await ethers.getContractFactory("FROFrontier");
    frontier = (await FROFrontier.connect(signer).deploy(addresses.address)) as FROFrontier
    await frontier.deployed()
  
    const FROStatus = await ethers.getContractFactory("FROStatus");
    status = (await FROStatus.connect(signer).deploy(addresses.address)) as FROStatus
    await status.deployed()
  
    const FROHp = await ethers.getContractFactory("FROHp");
    hp = (await FROHp.connect(signer).deploy(addresses.address)) as FROHp
    await hp.deployed()
  
    const FROTokenDescriptor = await ethers.getContractFactory("FROTokenDescriptor");
    descriptor = (await FROTokenDescriptor.connect(signer).deploy(addresses.address)) as FROTokenDescriptor
    await descriptor.deployed()
  
    const FROCharacter = await ethers.getContractFactory("FROCharacter");
    character = (await FROCharacter.connect(signer).deploy(addresses.address)) as FROCharacter
    await character.deployed()
  
    const FROReward = await ethers.getContractFactory("FROReward");
    reward = (await FROReward.connect(signer).deploy(addresses.address)) as FROReward
    await reward.deployed()
  
    const FROStaking = await ethers.getContractFactory("FROStaking");
    staking = (await FROStaking.connect(signer).deploy(addresses.address)) as FROStaking
    await staking.deployed()
  
    const FROToken = await ethers.getContractFactory("FROToken");
    token = (await FROToken.connect(signer).deploy(addresses.address)) as FROToken
    await token.deployed()
  
    const FROLogic = await ethers.getContractFactory("FROLogic");
    logic = (await FROLogic.connect(signer).deploy(addresses.address)) as FROLogic
    await logic.deployed()
  
    const FROMintLogic = await ethers.getContractFactory("FROMintLogic");
    mintLogic = (await FROMintLogic.connect(signer).deploy(addresses.address)) as FROMintLogic
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

    console.log("addresses: \"" + c.addresses.address + "\",")
    console.log("frontier: \"" + c.frontier.address + "\",")
    console.log("status: \"" + c.status.address + "\",")
    console.log("hp: \"" + c.hp.address + "\",")
    console.log("descriptor: \"" + c.descriptor.address + "\",")
    console.log("character: \"" + c.character.address + "\",")
    console.log("reward: \"" + c.reward.address + "\",")
    console.log("staking: \"" + c.staking.address + "\",")
    console.log("token: \"" + c.token.address + "\",")
    console.log("logic: \"" + c.logic.address + "\",")
    console.log("mintLogic: \"" + c.mintLogic.address + "\",")
  
    await c.addresses.connect(signer).setRegistry("FROFrontier", c.frontier.address)
    await c.addresses.connect(signer).setRegistry("FROStatus", c.status.address)
    await c.addresses.connect(signer).setRegistry("FROHp", c.hp.address)
    await c.addresses.connect(signer).setRegistry("FROTokenDescriptor", c.descriptor.address)
    await c.addresses.connect(signer).setRegistry("FROCharacter", c.character.address)
    await c.addresses.connect(signer).setRegistry("FROReward", c.reward.address)
    await c.addresses.connect(signer).setRegistry("FROStaking", c.staking.address)
    await c.addresses.connect(signer).setRegistry("FROToken", c.token.address)
    await c.addresses.connect(signer).setRegistry("FROLogic", c.logic.address)
    await c.addresses.connect(signer).setRegistry("FROMintLogic", c.mintLogic.address)
  
    return c
}

const setup = async (c: ContractType, tokenIds: number[], status: Status[]): Promise<void> => {
    if(tokenIds.length != status.length){
      console.error("tokenIds.length != status.length")
      return  
    }
  
    await c.status.setStatusByOwner(tokenIds,status)
  
    const MINTER_ROLE = await c.character.MINTER_ROLE()
    await c.character.grantRole(MINTER_ROLE, c.mintLogic.address)
  
    // await c.mintLogic.setMaxTokenId(initConst.mintMaxTokenId)
    // await c.frontier.setMaxFrontier(initConst.maxFrontier)
    // await c.logic.setEpoch(initConst.epoch)
    // await c.logic.setReviveEpoch(initConst.reviveEpoch)
    // await c.logic.setRewardPerBlock(initConst.rewardPerBlock)
  }

const verify = async (c: ContractType): Promise<void> => {
    await Verify(c.addresses.address, [])
    await Verify(c.frontier.address, [c.addresses.address])
    await Verify(c.status.address, [c.addresses.address])
    await Verify(c.hp.address, [c.addresses.address])
    await Verify(c.descriptor.address, [c.addresses.address])
    await Verify(c.character.address, [c.addresses.address])
    await Verify(c.reward.address, [c.addresses.address])
    await Verify(c.staking.address, [c.addresses.address])
    await Verify(c.token.address, [c.addresses.address])
    await Verify(c.logic.address, [c.addresses.address])
    await Verify(c.mintLogic.address, [c.addresses.address])
}

const verify2 = async (c: AddressesType): Promise<void> => {
    await Verify(c.addresses, [])
    await Verify(c.frontier, [c.addresses])
    await Verify(c.status, [c.addresses])
    await Verify(c.hp, [c.addresses])
    await Verify(c.descriptor, [c.addresses])
    await Verify(c.character, [c.addresses])
    await Verify(c.reward, [c.addresses])
    await Verify(c.staking, [c.addresses])
    await Verify(c.token, [c.addresses])
    await Verify(c.logic, [c.addresses])
    await Verify(c.mintLogic, [c.addresses])
}

const main = async () => {
    const signer = KmsSigner()
    const addresses = Addresses()!

    // const c = await deploy(signer)

    // setup(c, tokenIds, status)

    // await verify(c)    
    await verify2(addresses)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const tokenIds = [
        1,
2,
3,
4,
5,
6,
7,
8,
9,
10,
11,
12,
13,
14,
15,
16,
17,
18,
19,
20,
21,
22,
23,
24,
25,
26,
27,
28,
29,
30,
31,
32,
33,
34,
35,
36,
37,
38,
39,
40,
41,
42,
43,
44,
45,
46,
47,
48,
49,
50,
51,
52,
53,
54,
55,
56,
57,
58,
59,
60,
61,
62,
63,
64,
65,
66,
67,
68,
69,
70,
71,
72,
73,
74,
75,
76,
77,
78,
79,
80,
81,
82,
83,
84,
85,
86,
87,
88,
89,
90,
91,
92,
93,
94,
95,
96,
97,
98,
99,
100,
101,
102,
103,
104,
105,
106,
107,
108,
109,
110,
111,
112,
113,
114,
115,
116,
117,
118,
119,
120,
121,
122,
123,
124,
125,
126,
127,
128,
]

const status : Status[] = [
    {hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
{hp: 160,at: 140,df: 80,it: 100,sp: 100},
{hp: 160,at: 80,df: 140,it: 100,sp: 100},
{hp: 200,at: 100,df: 100,it: 100,sp: 100},
{hp: 240,at: 80,df: 100,it: 100,sp: 100},
{hp: 240,at: 100,df: 80,it: 100,sp: 100},
{hp: 160,at: 120,df: 100,it: 100,sp: 100},
{hp: 200,at: 120,df: 80,it: 100,sp: 100},
{hp: 160,at: 100,df: 120,it: 100,sp: 100},
{hp: 200,at: 80,df: 120,it: 100,sp: 100},
{hp: 280,at: 80,df: 80,it: 100,sp: 100},
]