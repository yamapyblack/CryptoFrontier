import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { FROFrontier } from "typechain/FROFrontier"
import { FROAddressRegistry } from "typechain/FROAddressRegistry"
import { FROToken } from "typechain/FROToken"
import { FROCharacter } from "typechain/FROCharacter"


describe("testing for CKCastle", async () => {
    let registroy: FROAddressRegistry
    let contract: FROFrontier
    let c1: FROCharacter
    let c2: FROToken

    const tokenId = 1
    const frontierId = 1

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const FROAddressRegistry = await ethers.getContractFactory("FROAddressRegistry");
        registroy = (await FROAddressRegistry.deploy()) as FROAddressRegistry
        await registroy.deployed()

        const FROCharacter = await ethers.getContractFactory("FROCharacter");
        c1 = (await FROCharacter.deploy(registroy.address)) as FROCharacter
        await c1.deployed()

        const FROToken = await ethers.getContractFactory("FROToken");
        c2 = (await FROToken.deploy(registroy.address)) as FROToken
        await c2.deployed()

        const FROFrontier = await ethers.getContractFactory("FROFrontier");
        contract = (await FROFrontier.deploy(registroy.address)) as FROFrontier
        await contract.deployed()

        registroy.setRegistry("FROCharacter", c1.address)
        registroy.setRegistry("FROToken", c2.address)
        registroy.setRegistry("FROFrontier", contract.address)        

        //mint
        c1["mint(address,uint256)"](addr1.address, tokenId)
    })

    describe("stake", async () => {
        it("success", async () => {
            //approve
            await c1.connect(addr1).setApprovalForAll(contract.address, true)

            await contract.connect(addr1).stake(tokenId, frontierId);
            await contract.connect(addr1).unStake(frontierId);

            const balance = await c2.balanceOf(addr1.address)
            console.log(balance.toString())
        });        

        // it("fail not a owner", async () => {
        //     await expect(contract.revive(tokenId)).revertedWith("sender is not owner of tokenId")
        // });        
        // it("fail hp not 0", async () => {
        //     await expect(contract.connect(addr1).revive(tokenId)).revertedWith("hp is not 0")
        // });        
        // it("fail hp not 0", async () => {
        //     await expect(contract.revive(tokenId)).revertedWith("hp is not 0")
        // });        
    });
});