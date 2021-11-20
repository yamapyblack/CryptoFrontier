import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { CRPGRevive } from "typechain/CRPGRevive"
import { AddressRegistry } from "typechain/AddressRegistry"
import { CRPGHpRegistory } from "typechain/CRPGHpRegistory"
import { CRPGStatus } from "typechain/CRPGStatus"
import { CRPGCharacter } from "typechain/CRPGCharacter"


describe("testing for CKCastle", async () => {
    let registroy: AddressRegistry
    let contract: CRPGRevive
    let c1: CRPGHpRegistory
    let c2: CRPGStatus
    let c3: CRPGCharacter

    type Status = {
        hp: BigNumberish
        at: BigNumberish
        mg: BigNumberish
        df: BigNumberish
        sp: BigNumberish
    }
    
    const tokenId = 1
    const status: Status = {
        hp: 10,
        at: 10,
        mg: 10,
        df: 10,
        sp: 10                
    }

    // expect((await c1.getHp(tokenId)).hp).equals(status.hp)
    // expect((await c2.getStatus(tokenId)).hp).equals(status.hp)
    
    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const AddressRegistry = await ethers.getContractFactory("AddressRegistry");
        registroy = (await AddressRegistry.deploy()) as AddressRegistry
        await registroy.deployed()

        const CRPGHpRegistory = await ethers.getContractFactory("CRPGHpRegistory");
        c1 = (await CRPGHpRegistory.deploy(registroy.address)) as CRPGHpRegistory
        await c1.deployed()

        const CRPGStatus = await ethers.getContractFactory("CRPGStatus");
        c2 = (await CRPGStatus.deploy(registroy.address)) as CRPGStatus
        await c2.deployed()

        const CRPGCharacter = await ethers.getContractFactory("CRPGCharacter");
        c3 = (await CRPGCharacter.deploy(registroy.address)) as CRPGCharacter
        await c3.deployed()

        registroy.setRegistry("CRPGHpRegistory", c1.address)
        registroy.setRegistry("CRPGStatus", c2.address)
        registroy.setRegistry("CRPGCharacter", c3.address)
        
        const CRPGRevive = await ethers.getContractFactory("CRPGRevive");
        contract = (await CRPGRevive.deploy(registroy.address)) as CRPGRevive
        await contract.deployed()

        //mint
        c3.mintSetStatus(addr1.address, tokenId, status)
    })

    describe("revive", async () => {
        it("fail not a owner", async () => {
            await expect(contract.revive(tokenId)).revertedWith("sender is not owner of tokenId")
        });        
        it("fail hp not 0", async () => {
            await expect(contract.connect(addr1).revive(tokenId)).revertedWith("hp is not 0")
        });        
        it("fail hp not 0", async () => {
            await expect(contract.revive(tokenId)).revertedWith("hp is not 0")
        });        
    });
});