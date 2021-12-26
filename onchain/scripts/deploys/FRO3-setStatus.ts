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

const tokenIds = [31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
]

const statuses : Status[] = [{hp: 100,at: 100,df: 140,it: 80,sp: 100,},
    {hp: 100,at: 100,df: 140,it: 80,sp: 100,},
    {hp: 100,at: 100,df: 140,it: 80,sp: 100,},
    {hp: 100,at: 100,df: 140,it: 80,sp: 100,},
    {hp: 100,at: 100,df: 140,it: 80,sp: 100,},
    {hp: 100,at: 100,df: 140,it: 80,sp: 100,},
    {hp: 100,at: 100,df: 100,it: 120,sp: 100,},
    {hp: 100,at: 100,df: 100,it: 120,sp: 100,},
    {hp: 100,at: 100,df: 100,it: 120,sp: 100,},
    {hp: 100,at: 100,df: 100,it: 120,sp: 100,},
    {hp: 100,at: 100,df: 100,it: 120,sp: 100,},
    {hp: 100,at: 100,df: 100,it: 120,sp: 100,},
    {hp: 100,at: 100,df: 100,it: 140,sp: 80,},
    {hp: 100,at: 100,df: 100,it: 140,sp: 80,},
    {hp: 100,at: 100,df: 100,it: 140,sp: 80,},
    {hp: 100,at: 100,df: 100,it: 140,sp: 80,},
    {hp: 100,at: 100,df: 100,it: 140,sp: 80,},
    {hp: 100,at: 100,df: 100,it: 140,sp: 80,},
    {hp: 100,at: 100,df: 100,it: 100,sp: 120,},
    {hp: 100,at: 100,df: 100,it: 100,sp: 120,},
    {hp: 100,at: 100,df: 100,it: 100,sp: 120,},
    {hp: 100,at: 100,df: 100,it: 100,sp: 120,},
    {hp: 100,at: 100,df: 100,it: 100,sp: 120,},
    {hp: 100,at: 100,df: 100,it: 100,sp: 120,},
    {hp: 80,at: 100,df: 100,it: 100,sp: 140,},
    {hp: 80,at: 100,df: 100,it: 100,sp: 140,},
    {hp: 80,at: 100,df: 100,it: 100,sp: 140,},
    {hp: 80,at: 100,df: 100,it: 100,sp: 140,},
    {hp: 80,at: 100,df: 100,it: 100,sp: 140,},
    {hp: 80,at: 100,df: 100,it: 100,sp: 140,},
]

const weapons = [6,
    6,
    6,
    6,
    6,
    6,
    7,
    7,
    7,
    7,
    7,
    7,
    8,
    8,
    8,
    8,
    8,
    8,
    9,
    9,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    10,
    10,
    ]

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
    6,
]