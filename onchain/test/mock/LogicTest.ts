import "@nomiclabs/hardhat-waffle"
import { ethers, network } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import {evmMine} from '../helper/Mine'

let owner:SignerWithAddress
let addr1:SignerWithAddress
let addr2:SignerWithAddress
let addr3:SignerWithAddress

//test contracts and parameters
import { LogicMock } from "typechain/LogicMock"

describe("testing for JointTest", async () => {
    let contract : LogicMock

    beforeEach(async () => {
        const LogicMock = await ethers.getContractFactory("LogicMock");
        contract = (await LogicMock.deploy()) as LogicMock
        await contract.deployed()
    })

    describe("claim", async () => {
        it("staking 1", async () => {

            const damage = await contract.calcDamage(19, 100, 100)
            console.log(damage.toString())
        });

    });
});