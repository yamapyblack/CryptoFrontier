import { network, ethers } from "hardhat";

export const evmMine = async (num: number): Promise<void> => {
  for(let i = 0; i < num; i++){
    await network.provider.send("evm_mine")
  }
}

export const getBlockNumber = async (): Promise<number> => {
  return ethers.provider.getBlockNumber()
}
