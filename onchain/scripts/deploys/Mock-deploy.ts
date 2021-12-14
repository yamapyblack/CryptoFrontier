import { ethers } from 'hardhat'
import { Addresses, KmsSigner } from "../common"
import { MathTest } from "typechain/MathTest"

const main = async () => {
    const signer = KmsSigner()
    const addresses = Addresses()!

    const c = await ethers.getContractFactory("MathTest");

    const contract = (await c.connect(signer).deploy()) as MathTest
    await contract.deployed();

    console.log('txHash', contract.deployTransaction.hash);
    console.log('MathTest: ' + contract.address + ",");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
