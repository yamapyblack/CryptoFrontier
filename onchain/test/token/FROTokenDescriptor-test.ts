import "@nomiclabs/hardhat-waffle"
import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { expect, use } from 'chai'
import { NilAddress } from "../helper/FROHelper";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

let owner: SignerWithAddress
let addr1: SignerWithAddress
let addr2: SignerWithAddress

//test contracts and parameters
import { FROAddresses } from "typechain/FROAddresses"
import { FROTokenDescriptor } from "typechain/FROTokenDescriptor"
import { FROStatus } from "typechain/FROStatus"
import { FROSvgWeapon } from "typechain/FROSvgWeapon"
import { FROSvgBase } from "typechain/FROSvgBase"

type Status = {
    hp: BigNumberish
    at: BigNumberish
    df: BigNumberish
    it: BigNumberish
    sp: BigNumberish
}

type Pixel = {
    x: number
    y: number
    rgb: string
}
  
describe("testing for FROCharacter", async () => {
    let registroy: FROAddresses
    let c1: FROStatus
    let c2: FROSvgBase
    let c3: FROSvgWeapon
    let c4: FROTokenDescriptor

    beforeEach(async () => {
        const signers = await ethers.getSigners()
        owner = signers[0]
        addr1 = signers[1]
        addr2 = signers[2]

        const FROAddresses = await ethers.getContractFactory("FROAddresses");
        registroy = (await FROAddresses.deploy()) as FROAddresses
        await registroy.deployed()

        const FROStatus = await ethers.getContractFactory("FROStatus");
        c1 = (await FROStatus.deploy(registroy.address)) as FROStatus
        await c1.deployed()

        const FROSvgBase = await ethers.getContractFactory("FROSvgBase");
        c2 = (await FROSvgBase.deploy()) as FROSvgBase
        await c2.deployed()

        const FROSvgWeapon = await ethers.getContractFactory("FROSvgWeapon");
        c3 = (await FROSvgWeapon.deploy()) as FROSvgWeapon
        await c3.deployed()

        const FROTokenDescriptor = await ethers.getContractFactory(
            "FROTokenDescriptor",
            { libraries: 
                {FROSvgBase: c2.address}
            }
        );
        c4 = (await FROTokenDescriptor.deploy(
            registroy.address,
        )) as FROTokenDescriptor
        await c4.deployed()

        registroy.setRegistry("FROStatus", c1.address)
        registroy.setRegistry("FROSvgWeapon", c3.address)
    })

    describe("tokenURI", async () => {

        it("success weapon", async () => {
            const tokenId = 1
            const statusParam: Status = {
                hp: 200,
                at: 100,
                df: 100,
                it: 80,
                sp: 70,
            }
            const weapon = 1
            const color = 1

            await c1.setStatusByOwner([1], [statusParam], [weapon], [color])

            // await c3.setWeaponPixels(weapon)

            const m = await c4.tokenURI(NilAddress, tokenId)
            const m2 = m.split(",")[1]
            const m3 = ethers.utils.toUtf8String(ethers.utils.base64.decode(m2))
            console.log(m3)
        });        
    });

});

const weapon: Pixel[] = [
    {x: 1,y: 8,rgb: "520"},
    {x: 2,y: 8,rgb: "520"},
    {x: 3,y: 8,rgb: "520"},
    {x: 4,y: 8,rgb: "520"},
    {x: 5,y: 8,rgb: "520"},
    {x: 6,y: 8,rgb: "520"},
    {x: 1,y: 9,rgb: "520"},
    {x: 6,y: 9,rgb: "520"},
    {x: 1,y: 10,rgb: "520"},
    {x: 3,y: 10,rgb: "C2E"},
    {x: 4,y: 10,rgb: "520"},
    {x: 6,y: 10,rgb: "520"},
    {x: 1,y: 11,rgb: "520"},
    {x: 4,y: 11,rgb: "520"},
    {x: 6,y: 11,rgb: "520"},
    {x: 7,y: 11,rgb: "520"},
    {x: 1,y: 12,rgb: "520"},
    {x: 2,y: 12,rgb: "520"},
    {x: 3,y: 12,rgb: "520"},
    {x: 4,y: 12,rgb: "520"},
    {x: 7,y: 12,rgb: "520"},
    {x: 8,y: 12,rgb: "520"},
    {x: 8,y: 13,rgb: "520"},
    {x: 9,y: 13,rgb: "520"},
    {x: 9,y: 14,rgb: "520"},
    {x: 10,y: 14,rgb: "520"},
    {x: 10,y: 15,rgb: "520"},
    {x: 11,y: 15,rgb: "520"},
    {x: 13,y: 15,rgb: "000"},
    {x: 14,y: 15,rgb: "000"},
    {x: 11,y: 16,rgb: "520"},
    {x: 12,y: 16,rgb: "000"},
    {x: 11,y: 17,rgb: "000"},
]
