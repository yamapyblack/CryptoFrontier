import { ethers } from 'hardhat'
import { BigNumberish, utils } from 'ethers'
import { Addresses, KmsSigner} from "../common"

import { FROToken } from "typechain/FROToken"

const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    let token: FROToken = await ethers.getContractAt("FROToken", a.FROToken, signer) as FROToken

    const tx = await token.mintByOwner(a.reward, utils.parseEther("12000"))
    console.log(tx)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
