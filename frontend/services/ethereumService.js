import { ethers } from 'ethers'

const ICharacter = require('../assets/jsons/ICharacter.json')
const IFrontier = require('../assets/jsons/IFrontier.json')
const ILogic = require('../assets/jsons/ILogic.json')
const IStaking = require('../assets/jsons/IStaking.json')
const IStatus = require('../assets/jsons/IStatus.json')
const IHp = require('../assets/jsons/IHp.json')
const IReward = require('../assets/jsons/IReward.json')

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

  shortenAddr(addr, len = 16) {
    if (addr.length < len) {
      return addr;
    }
    return addr.slice(0, len) + "...";
  }

  async changeChain() {
    if (window.ethereum) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [process.env.chainInfo],
      })
      await this.setChainId()
    }
  }

  async walletLogin() {
    if (typeof window.ethereum !== "undefined") {
      try{
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        console.log("account", account);
  
        await this.store.dispatch("setWalletAddress", account);
        await this.setChainId()
  
      }catch(e){
        console.error(e)
      }
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
    if(this.store.state.chainId != process.env.chainId){
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

  getEnvChainId() {
    return process.env.chainId
  }

  /* get from onchain */
  async getFrontier(_frontierId){
    const contract = new this.web3.eth.Contract(IFrontier.abi, process.env.FROFrontier)
    return await contract.methods.getFrontier(_frontierId).call({})
  }

  async getStake(_tokenId){
    const contract = new this.web3.eth.Contract(IStaking.abi, process.env.FROStaking)
    return await contract.methods.getStake(_tokenId).call({})
  }

  async getStatus(_tokenId){
    const contract = new this.web3.eth.Contract(IStatus.abi, process.env.FROStatus)
    return await contract.methods.getStatus(_tokenId).call({})
  }

  async getHp(_tokenId){
    const contract = new this.web3.eth.Contract(IHp.abi, process.env.FROHp)
    return await contract.methods.getHp(_tokenId).call({})
  }

  async isApprovedForAll(){
    const contract = new this.web3.eth.Contract(ICharacter.abi, process.env.FROCharacter)
    return await contract.methods.isApprovedForAll(this.store.state.walletAddress, process.env.FROStaking).call({})
  }

  async ownerOf(_tokenId){
    try{
      const contract = new this.web3.eth.Contract(ICharacter.abi, process.env.FROCharacter)
      return await contract.methods.ownerOf(_tokenId).call({})  
    }catch(e){
      console.log(e)
      return ''
    }
  }

  async rewards(_tokenId){
    console.log('rewards', _tokenId)

    const contract = new this.web3.eth.Contract(IReward.abi, process.env.FROReward)
    const rewardWei = await contract.methods.rewards(_tokenId).call({})
    return this.web3.utils.fromWei(rewardWei)
  }

  async canRevive(_tokenId){
    const unixtime = Math.floor( new Date().getTime() / 1000 ) ;

    const contract = new this.web3.eth.Contract(ILogic.abi, process.env.FROLogic)
    return await contract.methods.canRevive(_tokenId, unixtime).call({})
  }

  async isApprovedForAll(){
    const contract = new this.web3.eth.Contract(ICharacter.abi, process.env.FROCharacter)
    return await contract.methods.isApprovedForAll(this.store.state.walletAddress, process.env.FROStaking).call({})
  }

  async getBothBattleHp(_frontierId){
    console.log('getBothBattleHp', _frontierId)
  
    const contract = new this.web3.eth.Contract(ILogic.abi, process.env.FROLogic)
    return await contract.methods.getBothBattleHp(_frontierId).call({})
  }

  async tokenURI(_tokenId){
    console.log('tokenURI', _tokenId)

    const contract = new this.web3.eth.Contract(ICharacter.abi, process.env.FROCharacter)
    return await contract.methods.tokenURI(_tokenId).call({})
  }

  async decode(_encodedStr){
    return ethers.utils.toUtf8String(ethers.utils.base64.decode(_encodedStr))
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
  async sendTransaction(_to, _data){
    const transactionParameters = {
      to: _to,
      from: this.store.state.walletAddress,
      data: _data,
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

  async stake(_tokenId, _frontierId){
    console.log('stake', _tokenId, _frontierId);

    const contract = new this.web3.eth.Contract(ILogic.abi, process.env.FROLogic);
    this.sendTransaction(process.env.FROLogic, contract.methods.stake(_tokenId, _frontierId).encodeABI())
  }

  async unStake(_tokenId){
    console.log('unStake', _tokenId);

    const contract = new this.web3.eth.Contract(ILogic.abi, process.env.FROLogic);
    this.sendTransaction(process.env.FROLogic, contract.methods.unStake(_tokenId).encodeABI())
  }

  async revive(_tokenId){
    console.log('revive', _tokenId);

    const contract = new this.web3.eth.Contract(ILogic.abi, process.env.FROLogic);
    this.sendTransaction(process.env.FROLogic, contract.methods.revive(_tokenId).encodeABI())
  }

  async setApprovalForAll(){
    console.log('setApprovalForAll');

    const contract = new this.web3.eth.Contract(ICharacter.abi, process.env.FROCharacter)
    this.sendTransaction(process.env.FROCharacter, contract.methods.setApprovalForAll(process.env.FROStaking, true).encodeABI())
  }

  async withdrawReward(_tokenId){
    console.log('withdrawReward', _tokenId);

    const contract = new this.web3.eth.Contract(IReward.abi, process.env.FROReward)
    this.sendTransaction(process.env.FROReward, contract.methods.withdrawReward(_tokenId).encodeABI())
  }
}
