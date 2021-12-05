import "@nomiclabs/hardhat-waffle"
import { ethers, network } from 'hardhat'
import { BigNumberish, BigNumber } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { evmMine, getBlockNumber } from '../helper/Mine'
import { calcHp } from '../helper/Battle'

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

    const status1: Status = {
        hp: 200,
        at: 100,
        df: 100,
        it: 80,
        sp: 70
    }
    const status2: Status = {
        hp: 180,
        at: 120,
        df: 120,
        it: 80,
        sp: 70
    }

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
        status.setStatus(tokenId,status1)
        status.setStatus(tokenId2,status2)
        const MINTER_ROLE = await character.MINTER_ROLE()
        character.grantRole(MINTER_ROLE, mintLogic.address)
        mintLogic.setMaxRange(100)
        await frontier.setMaxFrontier(10)
        await logic.setEpoch(100) // test

    })

    describe("staking", async () => {
        it("staking 1", async () => {
            console.log("js block", (await getBlockNumber()).toString())       

            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            expect((await frontier.getFrontier(frontierId)).tokenIdA).equals(tokenId)
        });

        it("staking 2", async () => {
            console.log("js block", (await getBlockNumber()).toString())       

            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            await mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)
            await character.connect(addr2).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr2).stake(tokenId2, frontierId)
            expect((await frontier.getFrontier(frontierId)).tokenIdA).equals(tokenId)
            expect((await frontier.getFrontier(frontierId)).tokenIdB).equals(tokenId2)
        });

        it("staking 2 battle", async () => {
            console.log("js block", (await getBlockNumber()).toString())       

            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            await mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)
            await character.connect(addr2).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr2).stake(tokenId2, frontierId)

            let hps = await logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())

            await evmMine(100)

            hps = await logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())
            expect(hps.hpA).equals(calcHp(status1.hp, status2.at, status1.df))
            expect(hps.hpB).equals(calcHp(status2.hp, status1.at, status2.df))
        });

        it("staking 2, A is dead", async () => {
            console.log("js block", (await getBlockNumber()).toString())       

            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            await mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)
            await character.connect(addr2).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr2).stake(tokenId2, frontierId)

            let hps = await logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())

            await evmMine(300)

            hps = await logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())
            expect(hps.hpA).equals(0)
            expect(hps.hpB).equals(calcHp(status2.hp, status1.at, status2.df, 3))
        });

        it("staking 2, both dead", async () => {
            console.log("js block", (await getBlockNumber()).toString())       

            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            await mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)
            await character.connect(addr2).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr2).stake(tokenId2, frontierId)

            let hps = await logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())

            await evmMine(500)

            hps = await logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())
            expect(hps.hpA).equals(0)

            // TODO hpB
            // expect(hps.hpB).equals(0))
        });

        it("unStake only A", async () => {
            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr1).unStake(tokenId)

            expect(await character.connect(addr1).ownerOf(tokenId)).equals(addr1.address)
            const f = await frontier.getFrontier(frontierId)
            expect(f.tokenIdA).equals(0)
            expect(f.tokenIdB).equals(0)
            expect(f.blockNumber).equals(0)
        })

        it("unStake fail while battle", async () => {
            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            await mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)
            await character.connect(addr2).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr2).stake(tokenId2, frontierId)

            await expect(logic.connect(addr1).unStake(tokenId)).revertedWith("cannnot unstake while battle")
        })

        it("unStake A is Dead", async () => {
            //claim
            await mintLogic.connect(addr1).claim(tokenId);
            await mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await character.connect(addr1).setApprovalForAll(staking.address, true)
            await character.connect(addr2).setApprovalForAll(staking.address, true)

            await logic.connect(addr1).stake(tokenId, frontierId)
            await logic.connect(addr2).stake(tokenId2, frontierId)

            await evmMine(300)

            await logic.connect(addr1).unStake(tokenId)
            const f = await frontier.getFrontier(frontierId)
            expect(f.tokenIdA).equals(0)
            expect(f.tokenIdB).equals(tokenId2)
            // expect(f.blockNumber).equals(0)
        })



        // it("fail hp not 0", async () => {
        //     await expect(contract.connect(addr1).unStake(tokenId)).revertedWith("hp is not 0")
        // });        
        // it("fail hp not 0", async () => {
        //     await expect(contract.unStake(tokenId)).revertedWith("hp is not 0")
        // });        
    });
});