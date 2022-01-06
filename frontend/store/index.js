export const state = () => ({
  walletAddress: "",
});

export const mutations = {
  SET_WALLET_ADDRESS(state, walletAddress) {
    state.walletAddress = walletAddress;
  },
};

export const actions = {
  async login({ commit }, _context) {
    console.log('login')

    // TODO error handling

    if (typeof window.ethereum !== "undefined") {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      console.log("account", account);

      await commit("SET_WALLET_ADDRESS", account);

      // await ethereum.enable()
      // .catch(() => {
      // 	console.log('error')
      // })
    } else {
      console.log("MetaMask is not installed");
    }

  },
  
};
