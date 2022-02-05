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
    const tx = await status.setStatusByOwner(tokenIds,statuses,weapons,colors, {nonce: 53, gasLimit: 5100000, gasPrice: 91000000000})
    console.log(tx)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const tokenIds = [
    61,
62,
63,
64,
65,
66,
67,
68,
69,
70,
71,
72,
73,
74,
75,
76,
77,
78,
79,
80,
81,
82,
83,
84,
85,
86,
87,
88,
89,
90,
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
    {hp: 100,at: 100,df: 120,it: 100,sp: 100,},
]

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
    5,]

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