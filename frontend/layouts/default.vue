<template>
  <div class="container mx-auto">
    <header class="flex mt-4">
      <div class="w-7/12">
        <nuxt-link to="/">
          <img class="w-full" src="~/assets/img/logo.png" />
        </nuxt-link>
      </div>
      <div class="flex flex-row-reverse w-5/12 mt-8">

        <template v-if="walletAddress">
          <div class="ml-6"><button @click="linkMyNFTs()">MyNFTs</button></div>
          <div class="ml-6"><button @click="linkReward()">Rewards</button></div>

          <div v-if="chainId == 80001" class="ml-6">Polygon</div>
          <div v-else class="ml-6" @click="changeChain()">
          <button>Wrong Network</button>
          </div>
          <div class="ml-6">{{ $ethereumService.shortenAddr(walletAddress, 32) }}</div>
        </template>
        <div v-else class="ml-6">
          <button @click="connect()">Connect</button>
        </div>
      </div>
    </header>
    <nuxt />
    <footer class="mt-12">
      <div class="flex justify-center">
      </div>
      <div class="flex justify-center mb-4">© 2021 FrontierDAO</div>
    </footer>

    <v-snackbar
      v-model="isSnackbarVisible"
      text
      top
      right
      :timeout="3000"
    >
      <div @click="$store.dispatch('clearSnackbar')">
        {{ globalSnackbar.text }}
      </div>          
    </v-snackbar>

  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {
  },
  data: () => ({
    // globalSnackbar: {
    //   show: true,
    //   text: `Hello, I'm a snackbar`,
    // },
  }),
  async mounted() {
    await this.connect()
  },
  computed: {
    ...mapState(["walletAddress","chainId","globalSnackbar"]),
    isSnackbarVisible: {
      get() {
        return this.globalSnackbar.show;
      },
      set() {
        return this.$store.dispatch("clearSnackbar");
      },
    },
  },  
  methods: {
    getChainId: async function() {
      if(this.walletAddress.length == 0){return}
      const chainid = await this.$ethereumService.getChainId()
      console.log(chainid)
      return chainid
    },
    connect: async function() {
      console.log('connect')
      await this.$ethereumService.walletLogin()
    },
    changeChain: async function() {
      await this.$ethereumService.changeChain()
    },
    linkReward: function(i) {
      if(!this.$ethereumService.isLoginCorrectChain()){return}
      this.$router.push('/contents/reward')
    },
    linkMyNFTs: function(i) {
      if(!this.$ethereumService.isLoginCorrectChain()){return}
      this.$router.push('/contents/mynfts')
    },
  },
}
</script>

<style>
</style>
