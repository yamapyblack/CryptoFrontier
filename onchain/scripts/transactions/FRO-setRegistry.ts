import { ethers } from 'hardhat'
import { Addresses, KmsSigner} from "../common"

import { FROAddresses } from "typechain/FROAddresses"

const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    const contract = await ethers.getContractAt("FROAddresses", a.FROAddresses, signer) as FROAddresses

    const tx = await contract.connect(signer).setRegistry("FROLogic", a.FROLogic, {nonce: 56, gasPrice: 41000000000})
    console.log("setRegistry:", tx.hash)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

