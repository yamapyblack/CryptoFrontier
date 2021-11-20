import { network ,ethers } from "hardhat";
import { Bytes } from "ethers"

const toEthSignedMessageHash = (_message: string): string => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes("\x19Ethereum Signed Message:\n32" + _message))
}

const signMessage = async (address: string, _messageHash: string | Bytes): Promise<string> => {
  return await network.provider.send(
    "eth_sign",
    [address, ethers.utils.hexlify(_messageHash)]
  )
}

export const SignHelper = {
  toEthSignedMessageHash: toEthSignedMessageHash,
  signMessage: signMessage,
}

