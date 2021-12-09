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

import { MathTest } from "typechain/MathTest"
describe("testing for JointTest", async () => {
    let m: MathTest

    beforeEach(async () => {
        [owner, addr1, addr2, addr3,] = await ethers.getSigners()

        const MathTest = await ethers.getContractFactory("MathTest");
        m = (await MathTest.deploy()) as MathTest
        await m.deployed()
    })

    describe("revive", async () => {

        it("success", async () => {
            console.log((await m.calc1()).toString())
            console.log((await m.calc2()).toString())
            console.log((await m.calc3()).toString())            
        });
    });
});