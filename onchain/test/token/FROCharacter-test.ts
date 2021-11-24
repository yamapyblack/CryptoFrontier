import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { FROAddressRegistry } from "typechain/FROAddressRegistry"
import { FROCharacter } from "typechain/FROCharacter"
import { FROTokenDescriptor } from "typechain/FROTokenDescriptor"
import { FROStatus } from "typechain/FROStatus"

type Status = {
    hp: BigNumberish
    at: BigNumberish
    df: BigNumberish
    it: BigNumberish
    sp: BigNumberish
}
  
describe("testing for FROCharacter", async () => {
    let registroy: FROAddressRegistry
    let c1: FROStatus
    let c2: FROTokenDescriptor
    let character: FROCharacter

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const FROAddressRegistry = await ethers.getContractFactory("FROAddressRegistry");
        registroy = (await FROAddressRegistry.deploy()) as FROAddressRegistry
        await registroy.deployed()

        const FROStatus = await ethers.getContractFactory("FROStatus");
        c1 = (await FROStatus.deploy(registroy.address)) as FROStatus
        await c1.deployed()

        const FROTokenDescriptor = await ethers.getContractFactory("FROTokenDescriptor");
        c2 = (await FROTokenDescriptor.deploy(registroy.address)) as FROTokenDescriptor
        await c2.deployed()

        const FROCharacter = await ethers.getContractFactory("FROCharacter");
        character = (await FROCharacter.deploy(registroy.address)) as FROCharacter
        await character.deployed()

        registroy.setRegistry("FROStatus", c1.address)
        registroy.setRegistry("FROTokenDescriptor", c2.address)
        registroy.setRegistry("FROCharacter", character.address)
    })

    describe("tokenURI", async () => {

        it("success", async () => {
            const tokenId = 1
            const statusParam: Status = {
                hp: 200,
                at: 100,
                df: 100,
                it: 80,
                sp: 70
            }
            await character["mint(address,uint256)"](addr1.address, tokenId)
            await c1.setStatus(1, statusParam)

            const m = await character.tokenURI(tokenId)
            console.log(m)

            const m2 = m.split(",")[1]
            const m3 = ethers.utils.toUtf8String(ethers.utils.base64.decode(m2))
        });        
    });
});