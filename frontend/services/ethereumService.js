const environment = process.env.NODE_ENV || 'development'
const envSet = require(`../env.${environment}.js`)

const ICharacter = require('../assets/jsons/ICharacter.json')
const IFrontier = require('../assets/jsons/IFrontier.json')
const ILogic = require('../assets/jsons/ILogic.json')
const IStaking = require('../assets/jsons/IStaking.json')
const IStatus = require('../assets/jsons/IStatus.json')

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
      await this.setChainId()
    }
  }

  async walletLogin() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log("account", account);

      await this.store.dispatch("setWalletAddress", account);
      await this.setChainId()

      // await ethereum.enable()
      // .catch(() => {
      // 	console.log('error')
      // })
    } else {
      console.log("MetaMask is not installed");
      this.store.dispatch('showSnackbar', {show: true, text: "MetaMask is not installed"})
    }
  }

  isLoginCorrectChain() {
    if(this.store.state.walletAddress.length == 0){
      this.store.dispatch('showSnackbar', {show: true, text: "not connected"})
      return false
    }
    if(this.store.state.chainId != envSet.chainId){
      this.store.dispatch('showSnackbar', {show: true, text: "wrong network"})
      return false
    }
    return true
  }

  async getChainId() {
    return await this.web3.eth.net.getId()
  }

  async setChainId() {
    const chainId = await this.getChainId()
    await this.store.dispatch('setChainId', chainId)
  }

  /* get from onchain */
  async getFrontier(_frontierId){
    const contract = new this.web3.eth.Contract(IFrontier.abi, envSet.FROFrontier)
    return await contract.methods.getFrontier(_frontierId).call({})
  }

  async getStake(_tokenId){
    const contract = new this.web3.eth.Contract(IStaking.abi, envSet.FROStaking)
    return await contract.methods.getStake(_tokenId).call({})
  }

  async getStatus(_tokenId){
    const contract = new this.web3.eth.Contract(IStatus.abi, envSet.FROStatus)
    return await contract.methods.getStatus(_tokenId).call({})
  }

  async isApprovedForAll(){
    const contract = new this.web3.eth.Contract(ICharacter.abi, envSet.FROCharacter)
    return await contract.methods.isApprovedForAll(this.store.state.walletAddress, envSet.FROStaking).call({})
  }

  async ownerOf(_tokenId){
    try{
      const contract = new this.web3.eth.Contract(ICharacter.abi, envSet.FROCharacter)
      return await contract.methods.ownerOf(_tokenId).call({})  
    }catch(e){
      console.log(e)
      return ''
    }
  }

  async getBothBattleHp(_frontierId){
    console.log('this.web3.eth.net.getId()', await this.web3.eth.net.getId())

    const contract = new this.web3.eth.Contract(ILogic.abi, envSet.FROLogic)
    return await contract.methods.getBothBattleHp(_frontierId).call({})
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

  /* tx */
  async stake(_tokenId, _frontierId){
    console.log('stake', _tokenId, _frontierId);
    // const web3 = new Web3()

    const contract = new this.web3.eth.Contract(ILogic.abi, envSet.FROLogic);

    const transactionParameters = {
      to: envSet.FROLogic,
      from: this.store.state.walletAddress,
      data: contract.methods.stake(_tokenId, _frontierId).encodeABI(),
    };

    try{
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      console.log(txHash)

    } catch (e) {
      console.error(e)
      this.store.dispatch('showSnackbar', {show: true, text: "transaction failed"})
    }
  }

  async setApproveForAll(){
    console.log('setApproveForAll');

    const contract = new this.web3.eth.Contract(ICharacter.abi, envSet.FROCharacter)

    const transactionParameters = {
      to: envSet.FROStaking,
      from: this.store.state.walletAddress,
      data: contract.methods.setApproveForAll(envSet.FROStaking, true).encodeABI(),
    };

    try{
      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
      console.log(txHash)

    } catch (e) {
      console.error(e)
      this.store.dispatch('showSnackbar', {show: true, text: "transaction failed"})
    }
  }

}
