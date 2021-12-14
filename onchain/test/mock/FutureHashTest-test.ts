import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { evmMine, getBlockNumber } from "../helper/Mine";

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { FutureHashTest } from "typechain/FutureHashTest"

describe("testing for FutureHashTest", async () => {
    let c1: FutureHashTest

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const FutureHashTest = await ethers.getContractFactory("FutureHashTest");
        c1 = (await FutureHashTest.deploy()) as FutureHashTest
        await c1.deployed()

    })

    describe("test", async () => {

        it("success", async () => {

            console.log(await getBlockNumber())
            console.log(await c1.getHash())

            await evmMine(1000)

            console.log(await getBlockNumber())
            console.log(await c1.getHash())

     });        
    });
});