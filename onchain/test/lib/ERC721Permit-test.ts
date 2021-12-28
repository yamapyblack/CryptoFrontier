import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"
import { SignHelper } from '../helper/SignHelper'

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { ERC721PermitMock } from "typechain/ERC721PermitMock"
import { type } from "os"
  
describe("testing for ERC721PermitMock", async () => {
    let c: ERC721PermitMock

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const ERC721PermitMock = await ethers.getContractFactory("ERC721PermitMock");
        c = (await ERC721PermitMock.deploy()) as ERC721PermitMock
        await c.deployed()

    })

    describe("permitMock", async () => {
        it("success mock", async () => {

            const owner = addr1.address
            const spender = addr2.address
            const tokenId = 1
            const nonce = 0
            const deadline = 0

            const encodedData = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address','address','uint256','uint256','uint256'],[owner,spender,tokenId,0,deadline]))

            const sign = await SignHelper.signMessage(addr1.address, encodedData)
            const signVrs = ethers.utils.splitSignature(sign)

            const res = await c.permitMock(owner,spender,tokenId,deadline,signVrs.v, signVrs.r, signVrs.s)
            console.log(res)
        });        

        it("success mock", async () => {
            const owner = addr1.address
            const spender = addr2.address
            const tokenId = 1
            const nonce = await c.nonces(addr1.address)
            const deadline = 999999999999

            await c.mint(addr1.address, tokenId)
            expect(await c.ownerOf(tokenId)).equals(addr1.address)

            const encodedData = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address','address','uint256','uint256','uint256'],[owner,spender,tokenId,nonce,deadline]))

            const sign = await SignHelper.signMessage(addr1.address, encodedData)
            const signVrs = ethers.utils.splitSignature(sign)

            await c.permit(owner,spender,tokenId,deadline,signVrs.v, signVrs.r, signVrs.s)
            expect(await c.getApproved(tokenId)).equals(addr2.address)
            
        });        
   
    });
});