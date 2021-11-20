import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { CRPGCharacter } from "typechain/CRPGCharacter"
import { CRPGTokenDescriptor } from "typechain/CRPGTokenDescriptor"
import { CRPGStatus } from "typechain/CRPGStatus"

type Status = {
    hp: BigNumberish
    at: BigNumberish
    mg: BigNumberish
    df: BigNumberish
    sp: BigNumberish
}
  
describe("testing for CKCastle", async () => {
    let character: CRPGCharacter
    let tokenDescriptor: CRPGTokenDescriptor
    let status: CRPGStatus

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const CRPGStatus = await ethers.getContractFactory("CRPGStatus");
        status = (await CRPGStatus.deploy()) as CRPGStatus
        await status.deployed()

        const CRPGTokenDescriptor = await ethers.getContractFactory("CRPGTokenDescriptor");
        tokenDescriptor = (await CRPGTokenDescriptor.deploy(status.address)) as CRPGTokenDescriptor
        await tokenDescriptor.deployed()

        const CRPGCharacter = await ethers.getContractFactory("CRPGCharacter");
        character = (await CRPGCharacter.deploy(tokenDescriptor.address)) as CRPGCharacter
        await character.deployed()
    })

    describe("tokenURI", async () => {

        it("success", async () => {
            const tokenId = 1
            const statusParam: Status = {
                hp: 10,
                at: 11,
                mg: 12,
                df: 13,
                sp: 14
            }
            await character["mint(address,uint256)"](addr1.address, tokenId)
            await status.setStatus(1, statusParam)

            const m = await character.tokenURI(tokenId)
            console.log(m)

            const m2 = m.split(",")[1]
            const m3 = ethers.utils.toUtf8String(ethers.utils.base64.decode(m2))
        });        
    });
});