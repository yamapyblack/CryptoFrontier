import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { StorageTest } from "typechain/StorageTest"

describe("testing for FROCharacter", async () => {
    let c1: StorageTest

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const StorageTest = await ethers.getContractFactory("StorageTest");
        c1 = (await StorageTest.deploy()) as StorageTest
        await c1.deployed()

    })

    describe("test", async () => {

        it("success", async () => {

            const frontier = {
                tokenIdA: 101,
                tokenIdAHp: 200,
                tokenIdB: 102,
                tokenIdBHp: 200, 
                blockNumber: 1,        
            }

            await c1.setFrontier(frontier)
            const f1 = await c1.getFrontier(1)
            console.log('f1', f1)

            await c1.changeFrontier(105)
            const f2 = await c1.getFrontier(1)
            console.log('f2', f2)

     });        
    });
});