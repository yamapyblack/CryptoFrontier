import { defineNuxtPlugin } from "#app";
import { defaultAbiCoder } from "ethers/lib/utils";
import { keccak256 } from "ethers/lib/utils";
import Web3 from "web3";

const logicAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "unStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const logicAddr = "0x52a6a2698aE46ab26f4bec6136Ea89238b14D56c";
const tokenId = 1;

export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: {
        log: () => {
          console.log("world");
        },
      },
      wallet: {
        connect: async () => {
          if (typeof window.ethereum !== "undefined") {
            const accounts = await ethereum.request({
              method: "eth_requestAccounts",
            });
            const account = accounts[0];
            console.log("account", account);

            useState("walletAddress").value = account;

            // await ethereum.enable()
            // .catch(() => {
            // 	//TODO
            // 	console.log('error')
            // })
          } else {
            //TODO
            console.log("MetaMask is not installed");
          }
        },
        shortenAddr: (addr: string): string => {
          return addr.slice(0, 32);
        },

        stake: async () => {
          console.log("walletAddress", useState("walletAddress").value);

          const encodedData = keccak256(
            defaultAbiCoder.encode(["uint256"], [tokenId])
          );

          const transactionParameters = {
            // gasPrice: '0x09184e72a000',
            // gas: '0x2710',
            to: "0x52a6a2698aE46ab26f4bec6136Ea89238b14D56c", // logic
            from: useState("walletAddress").value,
            data: encodedData,
            chainId: 80001,
          };

          // txHash is a hex string
          // As with any RPC call, it may throw an error
          const txHash = await ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
          });
        },

        stake2: async () => {
          console.log(process.env.NODE_DEBUG);
          const w = new Web3()

          // const contract = new web3.eth.Contract(logicAbi, logicAddr);

          // const transactionParameters = {
          // 	to: logicAddr,
          // 	from: useState('walletAddress').value,
          // 	data: contract.methods.unStake(tokenId).encodeABI(),
          // };

          // try{
          // 	const txHash = await ethereum.request({
          // 		method: 'eth_sendTransaction',
          // 		params: [transactionParameters],
          // 	});

          // 	console.log(txHash)
          // } catch (e) {
          // 	console.error(e)
          // }
        },
      },
    },
  };
});
