import env, { ethers } from 'hardhat'
import { KmsEthersSigner } from "aws-kms-ethers-signer";
import { HttpNetworkConfig } from "hardhat/types"

export const NilAddress = "0x0000000000000000000000000000000000000000"
const region = process.env.AWS_REGION!;
const keyId = process.env.KMS_KEY_ID!;

export interface AddressesType {
  Deployer: string
  FROAddresses: string
  FROStatus: string
  FROHp: string
  FROSvg: string //old
  FROSvgBase: string
  FROTokenDescriptor: string
  FROCharacter: string
  FROMintLogic: string
  FROReward: string
  FROStaking: string
  FROToken: string
  FROFrontier: string
  FROLogic: string
  FROTokenTest: string
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
        // addresses: "0x6B889d814AC75255714adA38527BEE9533441519",
        // frontier: "0xE3dD3ABfeAA02B279177f748b97751e4868553F3",
        // status: "0x7121d703515638073Be323536FA672142FABbA44",
        // hp: "0x428843F997bD69b95d23F6105bFf5D8141641C62",
        // descriptor: "0xF14Ec6f5350E339116a4Adb3e78fd7691d6E48f8",
        // character: "0x80042C77bd21C6Af61dA0334ef5042663554c63D",
        // reward: "0x87cc8BaB70f91C6fb83d7DF14c4548093d15795F",
        // staking: "0x8E8A46ea40Bf0f8Bb940eB1D0C9ae4b7a335C932",
        // token: "0xfEEe0f789e5367cBc4fCf4a33F56d2B9b6b8b8Ad",
        // logic: "0x52a6a2698aE46ab26f4bec6136Ea89238b14D56c",
        // mintLogic: "0x16d5DBaa11Ee2B0f19D5837Bf31DF5AB2CFe1582",

        FROAddresses: "0x6B889d814AC75255714adA38527BEE9533441519",
        FROStatus: "0x0e3EA9Fb71FF871A3a2dFE9F4B80b44D6614ae51",
        FROHp: "0x470E38A5422Add8567a64748aAA51Fa36c1d3002",
        FROSvg: "0x9ba659388F3F11228aDB3336027af6522BA81c35",
        FROTokenDescriptor: "0xAda3D5820bAB9380460beDC43b0EffEE75ca5709",
        FROCharacter: "0xfa2cB59be9D3b591AF1D4001a27D3bB974d3b8c0",
        FROMintLogic: "0x77776B57dcE93577a3537aF466Bfe46eC596eeC8",
        FROReward: "0x9d744A836ffD3fE9828Da9660b2436a47631eD5a",
        FROStaking: "0xf7E06cfb2a8c3Fc2964824739eaAE268ba0Fbbeb",
        FROToken: "0x5b051652E81bb5383F7f0623Eff94598aE398B76",
        FROFrontier: "0xb830Dd5b0496681da4Ba46b76c0D83125aC48D5e",
        FROLogic: "0x0378e3C956b5D7d204620F457fDD64fA657D9224",
      } as AddressesType

    case "matic":
      return {
        Deployer: "0x76D8a627dA0EA33ABDF3A922E7dA6e6ee78ab7A1",
        FROAddresses: "0x264A8Ed6C52CbC4937AD7A7F62Cc066B83e37Ea8",
        FROStatus: "0x1D4c01f63a4d0a2B37D7993e6E92e5fB8FAcd586",
        FROHp: "0x1c24CbE9A306e04f12D4d1E9539048cD03f4027c",
        FROSvg: "0xd5dd91E33272d86d6176e3D8d111c99D6ee1edD1",
        FROTokenDescriptor: "0xdA02718148d40fD3F13fa8252c37726dE0faFF86",
        FROCharacter: "0x9689FF81Ddb4AE0bf29D5c53687842267CD5B563",
        FROMintLogic: "0x85a54817F409Dc1B4Dc3e13474836Bc642d2E96c",

        FROReward: "0x74EAbd235A44b37a181c1C2120C26f90D1b7C1e4",
        FROStaking: "0x37126C46fbbEC00f18Fc1717a7D3D1d01400975E",
        FROToken: "",
        FROFrontier: "0x332f25Ac74c1ED7a524CCb5ce6BFFC8bF792784c",
        FROLogic: "0x470E38A5422Add8567a64748aAA51Fa36c1d3002",
        FROTokenTest: "0xa07e1F3D92AB431F045a783865e12d12d9d56D9d",
      } as AddressesType

    case "optest":
      return {
        Deployer: "0x76D8a627dA0EA33ABDF3A922E7dA6e6ee78ab7A1",
        FROAddresses: "0x264A8Ed6C52CbC4937AD7A7F62Cc066B83e37Ea8",
        FROSvgBase: "0x264A8Ed6C52CbC4937AD7A7F62Cc066B83e37Ea8",
      } as AddressesType

    case "op":
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

