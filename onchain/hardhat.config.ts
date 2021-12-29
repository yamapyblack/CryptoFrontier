import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkAccountsConfig } from "hardhat/types"

import "solc"
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter"

const accounts = (): HttpNetworkAccountsConfig => {
  if (!process.env.PRIV_KEY) {
    return "remote"
  }
  return [process.env.PRIV_KEY!]
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    mumbai: { // matic testnet
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      gasPrice: 30000000000,
    },
    matic: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 137,
      gasPrice: 30000000000,
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  },
  gasReporter: {
    currency: 'MATIC',
    gasPrice: 30,
    enabled: true
  },
};

export default config;
