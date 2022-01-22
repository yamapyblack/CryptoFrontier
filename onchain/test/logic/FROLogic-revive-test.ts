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

import { HpMock } from "typechain/HpMock"
describe("testing for JointTest", async () => {
    let c: ContractType
    let hp: HpMock

    const tokenId1 = 1;
    const status1: Status = {
        hp: 200,
        at: 100,
        df: 100,
        it: 80,
        sp: 70
    }
    const frontierId = 1;

    beforeEach(async () => {
        [owner, addr1, addr2, addr3,] = await ethers.getSigners()

        c = await deploy()
        await c.status.setStatusByOwner([tokenId1], [status1], [1], [1])

        const HpMock = await ethers.getContractFactory("HpMock");
        hp = (await HpMock.deploy(c.addresses.address)) as HpMock
        await hp.deployed()

        await c.addresses.setRegistry("FROHp", hp.address)
    })

    describe("revive", async () => {
        it("fail not owner", async () => {
            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)

            await expect(c.logic.revive(tokenId1)).revertedWith("sender is not owner of tokenId")
        });

        it("fail not hp 0", async () => {
            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)

            await expect(c.logic.connect(addr1).revive(tokenId1)).revertedWith("cannot revive")
        });

        it("fail epoch", async () => {
            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            // set hp 0
            await hp.setHpMock(tokenId1, 0)

            await expect(c.logic.connect(addr1).revive(tokenId1)).revertedWith("cannot revive")
        });

        it("success", async () => {
            //claim
            await c.mintLogic.connect(addr1).claim(tokenId1);
            //approve
            await c.character.connect(addr1).setApprovalForAll(c.staking.address, true)
            // set hp 0
            await hp.setHpMock(tokenId1, 0)

            const MATIC_HOUR = (60 * 60) / 2;
            const reviveEpoch = MATIC_HOUR * 6; //6h        

            await evmMine(reviveEpoch + 100)

            await c.logic.connect(addr1).revive(tokenId1)
            expect((await hp.getHp(tokenId1)).hp).equals(200)
        });
    });
});