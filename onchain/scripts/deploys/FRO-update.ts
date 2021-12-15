import { ethers } from 'hardhat'
import { Signer, BigNumberish } from 'ethers'
import { Addresses, KmsSigner, Verify, AddressesType } from "../common"

import { FROAddresses } from "typechain/FROAddresses"
import { FROLogic } from "typechain/FROLogic"
import { FROMintLogic } from "typechain/FROMintLogic"


const main = async () => {
    const signer = KmsSigner()
    const addresses = Addresses()!

    // const c = await deploy(signer)
    await Verify(c.mintLogic, [c.addresses])

    // setup(c, tokenIds, status)

    // await verify(c)    
    await verify2(addresses)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
