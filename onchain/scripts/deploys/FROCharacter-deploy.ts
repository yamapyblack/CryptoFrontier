import { ethers } from 'hardhat'
import { Addresses, KmsSigner } from "../common"
import { FROAddresses } from "typechain/FROAddresses"
import { FROTokenDescriptor } from "typechain/FROTokenDescriptor"
import { FROStatus } from "typechain/FROStatus"

const main = async () => {
    const signer = KmsSigner()
    const addresses = Addresses()!

    const FROAddresses = await ethers.getContractFactory("FROAddresses");
    const registroy = (await FROAddresses.connect(signer).deploy()) as FROAddresses
    await registroy.deployed()
    console.log('txHash', registroy.deployTransaction.hash);
    console.log('address: ' + registroy.address + ",");

    const FROStatus = await ethers.getContractFactory("FROStatus");
    const c1 = (await FROStatus.connect(signer).deploy(registroy.address)) as FROStatus
    await c1.deployed()
    console.log('txHash', c1.deployTransaction.hash);
    console.log('address: ' + c1.address + ",");

    const FROTokenDescriptor = await ethers.getContractFactory("FROTokenDescriptor");
    const c2 = (await FROTokenDescriptor.connect(signer).deploy(registroy.address)) as FROTokenDescriptor
    await c2.deployed()
    console.log('txHash', c2.deployTransaction.hash);
    console.log('address: ' + c2.address + ",");

    registroy.setRegistry("FROStatus", c1.address)

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
