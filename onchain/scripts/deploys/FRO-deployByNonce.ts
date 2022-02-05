import { ethers } from 'hardhat'
import { Signer, BigNumberish, Contract } from 'ethers'
import { Addresses, KmsSigner} from "../common"

import { waffle } from "hardhat";
const { deployContract } = waffle;

const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    // const FROReward = require("../../artifacts/contracts/registory/FROReward.sol/FROReward.json");
    // const FROStaking = require("../../artifacts/contracts/registory/FROStaking.sol/FROStaking.json");
    const FROLogic = require("../../artifacts/contracts/logic/FROLogic.sol/FROLogic.json");
    // const FROFrontier = require("../../artifacts/contracts/registory/FROFrontier.sol/FROFrontier.json");

    //deploy
    const tx = await deployContract(signer, FROLogic, [a.FROAddresses], {
        gasPrice: 81000000000,
        nonce: 55,
    });
    console.log(tx.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

