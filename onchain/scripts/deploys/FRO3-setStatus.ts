import { ethers } from 'hardhat'
import { BigNumberish } from 'ethers'
import { Addresses, KmsSigner} from "../common"

import { FROStatus } from "typechain/FROStatus"

export type Status = {
    hp: BigNumberish
    at: BigNumberish
    df: BigNumberish
    it: BigNumberish
    sp: BigNumberish
}
  
const main = async () => {
    const signer = KmsSigner()
    const a = Addresses()!

    let status: FROStatus = await ethers.getContractAt("FROStatus", a.FROStatus, signer) as FROStatus

    //30 tokenIds
    const tx = await status.setStatusByOwner(tokenIds,statuses,weapons,colors, {gasLimit: 5100000})
    console.log(tx)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const tokenIds = [1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
]

const statuses : Status[] = [
    {hp: 120,at: 100,df: 100,it: 100,sp: 100,},
    {hp: 120,at: 100,df: 100,it: 100,sp: 100,},
    {hp: 120,at: 100,df: 100,it: 100,sp: 100,},
    {hp: 120,at: 100,df: 100,it: 100,sp: 100,},
    {hp: 120,at: 100,df: 100,it: 100,sp: 100,},
    {hp: 120,at: 100,df: 100,it: 100,sp: 100,},
    {hp: 140,at: 80,df: 100,it: 100,sp: 100,},
    {hp: 140,at: 80,df: 100,it: 100,sp: 100,},
    {hp: 140,at: 80,df: 100,it: 100,sp: 100,},
    {hp: 140,at: 80,df: 100,it: 100,sp: 100,},
    {hp: 140,at: 80,df: 100,it: 100,sp: 100,},
    {hp: 140,at: 80,df: 100,it: 100,sp: 100,},
    {hp: 100,at: 120,df: 100,it: 100,sp: 100,},
    {hp: 100,at: 120,df: 100,it: 100,sp: 100,},
    {hp: 100,at: 120,df: 100,it: 100,sp: 100,},
    {hp: 100,at: 120,df: 100,it: 100,sp: 100,},
    {hp: 100,at: 120,df: 100,it: 100,sp: 100,},
    {hp: 100,at: 120,df: 100,it: 100,sp: 100,},
    {hp: 100,at: 140,df: 80,it: 100,sp: 100,},
    {hp: 100,at: 140,df: 80,it: 100,sp: 100,},
    {hp: 100,at: 140,df: 80,it: 100,sp: 100,},
    {hp: 100,at: 140,df: 80,it: 100,sp: 100,},
    {hp: 100,at: 140,df: 80,it: 100,sp: 100,},
    {hp: 100,at: 140,df: 80,it: 100,sp: 100,},
    {hp: 100,at: 100,df: 120,it: 100,sp: 100,},
    {hp: 100,at: 100,df: 120,it: 100,sp: 100,},
    {hp: 100,at: 100,df: 120,it: 100,sp: 100,},
    {hp: 100,at: 100,df: 120,it: 100,sp: 100,},
    {hp: 100,at: 100,df: 120,it: 100,sp: 100,},
    {hp: 100,at: 100,df: 120,it: 100,sp: 100,},]

const weapons = [1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    5,   ]

const colors = [1,
    2,
    3,
    4,
    5,
    6,
    1,
    2,
    3,
    4,
    5,
    6,
    1,
    2,
    3,
    4,
    5,
    6,
    1,
    2,
    3,
    4,
    5,
    6,
    1,
    2,
    3,
    4,
    5,
    6,]