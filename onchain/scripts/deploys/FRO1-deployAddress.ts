import { ethers } from 'hardhat'
import { Signer, BigNumberish } from 'ethers'
import { Addresses, KmsSigner} from "../common"

import { FROAddresses } from "typechain/FROAddresses"

  const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    let addresses: FROAddresses
  
    const FROAddresses = await ethers.getContractFactory("FROAddresses");
    addresses = (await FROAddresses.connect(signer).deploy()) as FROAddresses
    await addresses.deployed()  

    console.log("addresses: \"" + addresses.address + "\",")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
