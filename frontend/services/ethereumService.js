const environment = process.env.NODE_ENV || 'development'
const envSet = require(`../env.${environment}.js`)

const logicAbi = require('../assets/jsons/logic.json')

const logicAddr = "0x52a6a2698aE46ab26f4bec6136Ea89238b14D56c";
const tokenId = 1
const frontierId = 1

export default class EthereumService {
  constructor(web3, store, app) {
    this.web3 = web3
    this.store = store
    this.app = app

    if (process.server) return

    if (window.ethereum && window.ethereum.on) {
      try {
        window.ethereum.on('accountsChanged', (accounts) => {
          this.logout()
        })
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  async changeChain() {
    if (window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [envSet.chainInfo],
      })
    }
  }

  async walletLogin() {
    try {
      await this.store.dispatch('login')
    } catch (e) {
      this.error = e
    }
  }

  async stake(){
    console.log('stake', this.store.state.walletAddress);
    // const web3 = new Web3()

    const contract = new this.web3.eth.Contract(logicAbi, logicAddr);

    const transactionParameters = {
      to: logicAddr,
      from: this.store.state.walletAddress,
      data: contract.methods.unStake(tokenId).encodeABI(),
    };

    try{
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log(txHash)
    } catch (e) {
      console.error(e)
    }

  }

  // async logout() {
  //   try {
  //     await this.store.dispatch('logout')
  //   } catch (e) {
  //     this.error = e
  //   }
  // }

  // async unlockWallet() {
  //   try {
  //     if (window.ethereum.enable) {
  //       await window.ethereum.enable()
  //     }
  //   } catch (e) {
  //     throw new Error(e)
  //   }
  // }

  async getBothBattleHp(){
    console.log('this.web3.eth.net.getId()', await this.web3.eth.net.getId())

    const contract = new this.web3.eth.Contract(logicAbi, logicAddr)

    await contract.methods.getBothBattleHp(frontierId).call({})

    // const transactionParameters = {
    //   to: logicAddr,
    //   from: this.store.state.walletAddress,
    //   data: contract.methods.owner().encodeABI(),
    // }

    // try{
    //   const txHash = await ethereum.request({
    //     method: 'eth_call',
    //     params: [transactionParameters],
    //   });
    //   console.log(txHash)
    // } catch (e) {
    //   console.error(e)
    // }
  }

}
