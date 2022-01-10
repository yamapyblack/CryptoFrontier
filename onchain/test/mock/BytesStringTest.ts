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

import { BytesStringTest } from "typechain/BytesStringTest"

describe("testing for Test", async () => {
    let m: BytesStringTest

    beforeEach(async () => {
        [owner, addr1, addr2, addr3,] = await ethers.getSigners()

        const BytesStringTest = await ethers.getContractFactory("BytesStringTest");
        m = (await BytesStringTest.deploy()) as BytesStringTest
        await m.deployed()
    })

    describe("test", async () => {

        it("success", async () => {
            console.log(await m.svg())
        });
    });
});