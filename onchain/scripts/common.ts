import env, { ethers } from 'hardhat'
import { KmsEthersSigner } from "aws-kms-ethers-signer";
import { HttpNetworkConfig } from "hardhat/types"

export const NilAddress = "0x0000000000000000000000000000000000000000"
const region = process.env.AWS_REGION!;
const keyId = process.env.KMS_KEY_ID!;

export interface AddressesType {
  Deployer: string
  addresses: string
  frontier: string
  status: string
  hp: string
  descriptor: string
  character: string
  reward: string
  staking: string
  token: string
  logic: string
  mintLogic: string
}

export const address = (name: string): string => {
  const contract = require("./../build/contracts/" + name + ".json")
  const chainid = env.network.config.chainId!.toString()
  return contract["networks"][chainid]["address"] as string
}

export const abi = (name: string): string => {
  const contract = require("./../build/contracts/" + name + ".json")
  return contract["abi"]
}

export const Addresses = () => {
  switch (env.network.name) {
    case "mumbai":
      return {
        Deployer: "0x76D8a627dA0EA33ABDF3A922E7dA6e6ee78ab7A1",
        addresses: "0xF7e3A4463ecCE0B2C76677168732Fe3baA05c609",
        frontier: "0xE3dD3ABfeAA02B279177f748b97751e4868553F3",
        status: "0x7121d703515638073Be323536FA672142FABbA44",
        hp: "0x428843F997bD69b95d23F6105bFf5D8141641C62",
        descriptor: "0xF14Ec6f5350E339116a4Adb3e78fd7691d6E48f8",
        character: "0x80042C77bd21C6Af61dA0334ef5042663554c63D",
        reward: "0x87cc8BaB70f91C6fb83d7DF14c4548093d15795F",
        staking: "0x8E8A46ea40Bf0f8Bb940eB1D0C9ae4b7a335C932",
        token: "0xfEEe0f789e5367cBc4fCf4a33F56d2B9b6b8b8Ad",
        logic: "0x52a6a2698aE46ab26f4bec6136Ea89238b14D56c",
        mintLogic: "0x16d5DBaa11Ee2B0f19D5837Bf31DF5AB2CFe1582",
    } as AddressesType

    case "matic":
      return {
        Deployer: "0x76D8a627dA0EA33ABDF3A922E7dA6e6ee78ab7A1",
      } as AddressesType

    default:
      return undefined
  }
}

// export const KmsSigner = () => {

//   const kmsProvider = new KmsProvider(
//     (env.network.config as HttpNetworkConfig).url,
//     { region, keyIds: [keyId] },
//   );

//   const provider = new ethers.providers.Web3Provider(kmsProvider)
//   return provider.getSigner(0)
// }

export const KmsSigner = () => {
  const rpcUrl = (env.network.config as HttpNetworkConfig).url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new KmsEthersSigner({ keyId }).connect(provider);

  return signer
}

export const Verify = async (address: string, args: any[]) => {
  try {
    await env.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message == "Missing or invalid ApiKey") {
      console.log("Skip verifing with", e.message)
      return
    }
    if (e.message == "Contract source code already verified") {
      console.log("Skip verifing with", e.message)
      return
    }
    throw e
  }
}

