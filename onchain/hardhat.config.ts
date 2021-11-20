import { HardhatUserConfig } from "hardhat/config";
import { HttpNetworkAccountsConfig } from "hardhat/types"

import "solc"
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import "@nomiclabs/hardhat-etherscan";

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
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 4,
      accounts: accounts(),
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 1,
      gasPrice: 48000000000,
      accounts: accounts(),
    },
    mumbai: { // matic testnet
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      gasPrice: 1000000000,
      accounts: accounts(),
    },
    matic: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 137,
      gasPrice: 2000000000,
      accounts: accounts(),
    },
  },
  solidity: {
    version: "0.8.6",
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
  }
};

export default config;
