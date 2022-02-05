import { ethers } from 'hardhat'
import { Addresses, KmsSigner} from "../common"

import { FROMintLogic } from "typechain/FROMintLogic"

const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    const contract = await ethers.getContractAt("FROMintLogic", a.FROMintLogic, signer) as FROMintLogic

    const tx = await contract.connect(signer).setMaxTokenId(91, {nonce: 54, gasPrice: 121000000000})
    console.log("setRegistry:", tx.hash)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

