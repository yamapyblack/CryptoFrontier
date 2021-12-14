import { ethers } from 'hardhat'
import { Addresses, KmsSigner } from "../common"
import { FutureHashTest } from "typechain/FutureHashTest"

const main = async () => {
    const signer = KmsSigner()
    const addresses = Addresses()!

    // const c = await ethers.getContractFactory("FutureHashTest");

    // const contract = (await c.connect(signer).deploy()) as FutureHashTest
    // await contract.deployed();

    // console.log('txHash', contract.deployTransaction.hash);
    // console.log('FutureHashTest: ' + contract.address + ",");

    
    const c2 = (await ethers.getContractAt("FutureHashTest", "0x37126C46fbbEC00f18Fc1717a7D3D1d01400975E", signer)) as FutureHashTest
    const h = await c2.getHash()
    console.log(h);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
