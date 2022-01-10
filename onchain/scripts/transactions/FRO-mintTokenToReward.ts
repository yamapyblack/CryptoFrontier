import { ethers } from 'hardhat'
import { Addresses, KmsSigner } from "../common"
import { FROToken } from "typechain/FROToken"
import { utils } from 'ethers'

const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    const contract = (await ethers.getContractAt("FROToken", a.FROToken, signer)) as FROToken

    const target = a.FROReward
    const amount = 100

    const tx = await contract.connect(signer).mintByOwner(target, utils.parseEther(amount.toString()));
    console.log('txHash:', tx.hash)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
