import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner:SignerWithAddress
let addr1:SignerWithAddress
let addr2:SignerWithAddress
let addr3:SignerWithAddress

//test contracts and parameters
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

type Status = {
    hp: BigNumberish
    at: BigNumberish
    df: BigNumberish
    it: BigNumberish
    sp: BigNumberish
}
type Frontier = {
    tokenIdA: BigNumberish
    tokenIdB: BigNumberish
    blockNumber: BigNumberish
}

describe("testing for JointTest", async () => {
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

    const tokenId = 1;
    const tokenId2 = 2;
    const frontierId = 1;

    beforeEach(async () => {
        [owner, addr1, addr2, addr3,] = await ethers.getSigners()

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

        addresses.setRegistry("FROFrontier", frontier.address)
        addresses.setRegistry("FROStatus", status.address)
        addresses.setRegistry("FROHp", hp.address)
        addresses.setRegistry("FROTokenDescriptor", descriptor.address)
        addresses.setRegistry("FROCharacter", character.address)
        addresses.setRegistry("FROReward", reward.address)
        addresses.setRegistry("FROStaking", staking.address)
        addresses.setRegistry("FROToken", token.address)
        addresses.setRegistry("FROLogic", logic.address)
        addresses.setRegistry("FROMintLogic", mintLogic.address)

        //setup
        const status1: Status = {
            hp: 200,
            at: 100,
            df: 100,
            it: 80,
            sp: 70
        }
        status.setStatus(1,status1)
        const MINTER_ROLE = await character.MINTER_ROLE()
        character.grantRole(MINTER_ROLE, mintLogic.address)
        mintLogic.setMaxRange(100)
        const frontierNil: Frontier = {
            tokenIdA: 0,
            tokenIdB: 0,
            blockNumber: 0,
        }
        await frontier.setMaxFrontier(10)

    })

    describe("claim", async () => {
        it("staking 1", async () => {
            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            // const fro1 = await frontier.getFrontier(frontierId)
            // console.log(fro1)

        });

        it("staking 2", async () => {
            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            await mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)
            await character.connect(addr2).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr2).stake(tokenId2, frontierId)
            const fro1 = await frontier.getFrontier(frontierId)
            console.log(fro1)
        });


        // it("fail hp not 0", async () => {
        //     await expect(contract.connect(addr1).revive(tokenId)).revertedWith("hp is not 0")
        // });        
        // it("fail hp not 0", async () => {
        //     await expect(contract.revive(tokenId)).revertedWith("hp is not 0")
        // });        
    });
});