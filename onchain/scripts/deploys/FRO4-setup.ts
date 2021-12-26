import { ethers } from 'hardhat'
import { Signer, BigNumberish, Contract } from 'ethers'
import { Addresses, KmsSigner} from "../common"

import { FROAddresses } from "typechain/FROAddresses"
// import { FROAddressesProxy } from "typechain/FROAddressesProxy"
import { FROFrontier } from "typechain/FROFrontier"
import { FROStatus } from "typechain/FROStatus"
import { FROHp } from "typechain/FROHp"
import { FROTokenDescriptor } from "typechain/FROTokenDescriptor"
import { FROCharacter } from "typechain/FROCharacter"
import { FROReward } from "typechain/FROReward"
import { FROStaking } from "typechain/FROStaking"
import { FROToken } from "typechain/FROToken"
import { FROLogic } from "typechain/FROLogic"
import { FROMintLogic } from "typechain/FROMintLogic"

const setup = async (mintLogic: FROMintLogic, frontier: FROFrontier, logic: FROLogic): Promise<void> => {    
    // await c.mintLogic.setMaxTokenId(initConst.mintMaxTokenId)
    // await c.frontier.setMaxFrontier(initConst.maxFrontier)
    // await c.logic.setEpoch(initConst.epoch)
    // await c.logic.setReviveEpoch(initConst.reviveEpoch)
    // await c.logic.setRewardPerBlock(initConst.rewardPerBlock)
}


const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    // setup(mintLogic, frontier, logic)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

