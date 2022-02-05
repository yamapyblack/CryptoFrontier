import { ethers } from 'hardhat'
import { utils } from "ethers"
import { Addresses, KmsSigner, NilAddress } from "../common"

const main = async () => {
    const signer = KmsSigner()
    const addresses = Addresses()!

    const amount = "0"
    const len = 10
    const startNonce = 30

    for(let i = 0; i < len; i++){
        const tx = await signer.sendTransaction({
            to: "0xCDF4f278c469Fd3961707D6b4D54B8f244eA5d9E",
            value: ethers.utils.parseEther(amount),
            nonce: startNonce + i,
            gasPrice: 641000000000,
        })
        console.log(tx)    
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
