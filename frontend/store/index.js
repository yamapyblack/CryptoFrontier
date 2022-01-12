export const state = () => ({
  walletAddress: "",
  chainId: 0,
  globalSnackbar: {
    show: false,
    text: `Hello, I'm a snackbar yes!!!`,
  },
});

export const mutations = {
  SET_WALLET_ADDRESS(state, walletAddress) {
    state.walletAddress = walletAddress;
  },
  SET_CHAIN_ID(state, chainId) {
    state.chainId = chainId;
  },
  SET_SNACKBAR (state, snackbar) {
    state.globalSnackbar = snackbar
  },
};

export const actions = {
  async setChainId({ commit }, chainId) {
    await commit("SET_CHAIN_ID", chainId);
  },

  async setWalletAddress({ commit }, walletAddress) {
    await commit("SET_WALLET_ADDRESS", walletAddress);
  },

  async showSnackbar({ commit }, { show: show, text: text }) {
    await commit('SET_SNACKBAR', { show: show, text: text })
  },

  async clearSnackbar({ commit }) {
    await commit('SET_SNACKBAR', { show: false, text: ""} )
  },
  
};
