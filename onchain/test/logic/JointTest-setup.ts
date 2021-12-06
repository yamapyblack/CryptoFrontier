import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish, BigNumber } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { evmMine, getBlockNumber } from '../helper/Mine'
import { deploy, setup, ContractType, Util, Status } from '../helper/FROHelper'

let owner:SignerWithAddress
let addr1:SignerWithAddress
let addr2:SignerWithAddress
let addr3:SignerWithAddress

describe("testing for JointTest", async () => {
    let c: ContractType

    const tokenId1 = 1;
    const tokenId2 = 2;
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
    const frontierId = 1;

    beforeEach(async () => {
        [owner, addr1, addr2, addr3,] = await ethers.getSigners()

        c = await deploy()
        await setup(c, [tokenId1, tokenId2], [status1, status2])
    })

    describe("staking", async () => {
        it("staking 1", async () => {
            console.log("Test: block", (await getBlockNumber()).toString())       

            //claim
            await c.mintLogic!.connect(addr1).claim(tokenId1);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            expect((await c.frontier.getFrontier(frontierId)).tokenIdA).equals(tokenId1)
        });

        it("staking 2", async () => {
            console.log("Test: block", (await getBlockNumber()).toString())       

            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            await c.mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            await c.character.connect(addr2).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            await c.logic.connect(addr2).stake(tokenId2, frontierId)
            expect((await c.frontier.getFrontier(frontierId)).tokenIdA).equals(tokenId1)
            expect((await c.frontier.getFrontier(frontierId)).tokenIdB).equals(tokenId2)

            expect(await c.reward.rewards(tokenId1)).equals(10000)
            expect(await c.reward.rewards(tokenId2)).equals(0)
        });

        it("staking 2 battle", async () => {
            console.log("Test: block", (await getBlockNumber()).toString())       

            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            await c.mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            await c.character.connect(addr2).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            await c.logic.connect(addr2).stake(tokenId2, frontierId)

            let hps = await c.logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())

            await evmMine(100)

            hps = await c.logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())
            expect(hps.hpA).equals(Util.calcHp(status1.hp, status2.at, status1.df))
            expect(hps.hpB).equals(Util.calcHp(status2.hp, status1.at, status2.df))
            
            expect(await c.reward.rewards(tokenId1)).equals(10000)
            expect(await c.reward.rewards(tokenId2)).equals(0)
        });

        it("c.staking 2, A is dead", async () => {
            console.log("Test: block", (await getBlockNumber()).toString())       

            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            await c.mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            await c.character.connect(addr2).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            await c.logic.connect(addr2).stake(tokenId2, frontierId)

            let hps = await c.logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())

            await evmMine(300)

            hps = await c.logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())
            expect(hps.hpA).equals(0)
            expect(hps.hpB).equals(Util.calcHp(status2.hp, status1.at, status2.df, 3))

            //reward
            expect(await c.reward.rewards(tokenId1)).equals(10000)
            expect(await c.reward.rewards(tokenId2)).equals(0)
            //hp
            //frontier
            //token

        });

        it("c.staking 2, both dead", async () => {
            console.log("Test: block", (await getBlockNumber()).toString())       

            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            await c.mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            await c.character.connect(addr2).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            await c.logic.connect(addr2).stake(tokenId2, frontierId)

            let hps = await c.logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())

            await evmMine(500)

            hps = await c.logic.getBattleHp(frontierId)
            console.log("hp", hps.hpA.toString(), hps.hpB.toString())
            expect(hps.hpA).equals(0)

            expect(await c.reward.rewards(tokenId1)).equals(10000)
            expect(await c.reward.rewards(tokenId2)).equals(0)
        });

        it("unStake only A", async () => {
            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            await c.logic.connect(addr1).unStake(tokenId1)

            expect(await c.character.connect(addr1).ownerOf(tokenId1)).equals(addr1.address)
            const f = await c.frontier.getFrontier(frontierId)
            expect(f.tokenIdA).equals(0)
            expect(f.tokenIdB).equals(0)
            expect(f.blockNumber).equals(0)

            expect(await c.reward.rewards(tokenId1)).equals(10000)
        })

        it("unStake fail while battle", async () => {
            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            await c.mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            await c.character.connect(addr2).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            await c.logic.connect(addr2).stake(tokenId2, frontierId)

            await expect(c.logic.connect(addr1).unStake(tokenId1)).revertedWith("cannnot unstake while battle")
            expect(await c.reward.rewards(tokenId1)).equals(10000)
            expect(await c.reward.rewards(tokenId2)).equals(0)
        })

        it("unStake A is Dead", async () => {
            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            await c.mintLogic.connect(addr2).claim(tokenId2);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            await c.character.connect(addr2).setApprovalForAll(c.staking.address, true)

            await c.logic.connect(addr1).stake(tokenId1, frontierId)
            await c.logic.connect(addr2).stake(tokenId2, frontierId)

            await evmMine(300)

            await c.logic.connect(addr1).unStake(tokenId1)
            const f = await c.frontier.getFrontier(frontierId)
            expect(f.tokenIdA).equals(0)
            expect(f.tokenIdB).equals(tokenId2)
            // expect(f.blockNumber).equals(0)

            const reward1 = await c.reward.rewards(tokenId1)
            const reward2 = await c.reward.rewards(tokenId2)
            console.log("reward1", reward1.toString())
            //TODO　ここ０なのダメな気がする
            console.log("reward2", reward2.toString())

        })



        // it("fail hp not 0", async () => {
        //     await expect(contract.connect(addr1).unStake(tokenId)).revertedWith("hp is not 0")
        // });        
        // it("fail hp not 0", async () => {
        //     await expect(contract.unStake(tokenId)).revertedWith("hp is not 0")
        // });        
    });
});