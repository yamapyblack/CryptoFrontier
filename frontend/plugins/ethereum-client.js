import Web3 from 'web3'
import EthereumService from '~/services/ethereumService.js'

const ethereumPlugin = ({ store, app }, inject) => {
  if (process.server) return
  let web3 = null 
  if (window.ethereum) {
    // Use MetaMask provider
    web3 = new Web3(window.ethereum)
  }
  inject('ethereumService', new EthereumService(web3, store, app))
}

export default ethereumPlugin
