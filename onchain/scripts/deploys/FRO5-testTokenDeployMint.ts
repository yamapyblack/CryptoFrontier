import { ethers } from 'hardhat'
import { Signer, BigNumberish, Contract } from 'ethers'
import { Addresses, KmsSigner} from "../common"

import { FROReward } from "typechain/FROReward"
import { FROTokenTest } from "typechain/FROTokenTest"
import { FROAddresses } from 'typechain/FROAddresses'

const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    //deploy
    const factory = await ethers.getContractFactory("FROTokenTest")
    const contract = (await factory.connect(signer).deploy(a.FROAddresses)) as FROTokenTest
    await contract.deployed()
    console.log("FROTokenTest: \"" + contract.address + "\",")

    const address: FROAddresses = await ethers.getContractAt("FROAddresses", a.FROAddresses, signer) as FROAddresses
    const tx = await address.connect(signer).setRegistry("FROToken", contract.address) // FROToken
    console.log("setRegistry:", tx.hash)

    //mint
    const tx2 = contract.connect(signer).mintByOwner(a.FROReward, ethers.utils.parseEther("47500000"))
    console.log(tx2)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

