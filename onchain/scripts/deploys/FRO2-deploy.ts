import { ethers } from 'hardhat'
import { Signer, Contract, ContractFactory } from 'ethers'
import { Libraries } from 'hardhat/types'
import { Addresses, KmsSigner} from "../common"

import { FROAddresses } from "typechain/FROAddresses"
// import { FROAddressesProxy } from "typechain/FROAddressesProxy"
import { FROSvgBase } from "typechain/FROSvgBase"

type Lib = {
    key: string
    address: string
}
let signer: Signer
let addresses: FROAddresses

const deploy = async(name: string, libraries?: Libraries): Promise<void> => {
    let factory: ContractFactory

    factory = await ethers.getContractFactory(name,            
        { libraries: 
            libraries
        }
    );

    const contract = (await factory.connect(signer).deploy(addresses.address)) as Contract
    await contract.deployed()
    console.log(name + ": \"" + contract.address + "\",")

    const tx = await addresses.connect(signer).setRegistry(name, contract.address)
    console.log("setRegistry:", tx.hash)
}


const main = async () => {
    signer = KmsSigner()
    const a = Addresses()!

    addresses = await ethers.getContractAt("FROAddresses", a.FROAddresses, signer) as FROAddresses

    // await deploy("FROStatus")
    // await deploy("FROHp")

    // const FROSvgBase = await ethers.getContractFactory("FROSvgBase");
    // const svg = (await FROSvgBase.connect(signer).deploy()) as FROSvgBase
    // await svg.deployed()
    // console.log("FROSvgBase" + ": \"" + svg.address + "\",")

    // await deploy("FROTokenDescriptor", {FROSvgBase: svg.address})
    // await deploy("FROCharacter")
    // await deploy("FROMintLogic")
    // await deploy("FROReward")
    // await deploy("FROStaking")
    // await deploy("FROToken")
    // await deploy("FROFrontier")
    await deploy("FROLogic")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

