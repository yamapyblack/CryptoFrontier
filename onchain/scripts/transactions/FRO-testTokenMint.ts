import { ethers } from 'hardhat'
import { Addresses, KmsSigner} from "../common"

import { FROTokenTest } from "typechain/FROTokenTest"

const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    const contract: FROTokenTest = await ethers.getContractAt("FROTokenTest", a.FROTokenTest, signer) as FROTokenTest

    //mint
    const tx = await contract.connect(signer).mintByOwner(a.FROReward, ethers.utils.parseEther("47500000"), {nonce: 52})
    console.log(tx)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

