<template>
  <div class="container mx-auto">
    <div class="flex justify-between mt-6">
      <div class="w-44 font-bold text-xl">
        Your Rewards
      </div>
    </div>

    <div class="mt-6">
      <!-- black left -->
      <template>
        <div class="mx-auto w-1/3 bg-black/[.5] p-8">
          <div class="mt-6">TokenID</div>
          <div class="w-full">
            <input type="number" v-model.number="selectedTokenId"  placeholder="tokenID" class="w-full bg-gray-800 p-2 border-none rounded text-white">
          </div>

          <div class="mt-12 text-center">
            <button
              class="text-frontier border-solid border-2 rounded-xl border-frontier px-6 py-1 font-bold"
              @click="checkReward()"
            >
              Check Reward
            </button>
          </div>

          <div class="mt-12 flex justify-between">
            <div class="">Reward</div>
            <div class="">{{ reward }} FRO</div>
          </div>

          <div class="mt-12 text-center">
            <button
              class="text-frontier border-solid border-2 rounded-xl border-frontier px-10 py-1 font-bold"
              @click="withdraw()"
            >
              Withdraw
            </button>
          </div>

        </div>
        <!-- black left -->
      </template>

    </div>

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Web3 from "web3";

export default {
  components: {
  },
  data() {
    return {
      reward: 0,
      selectedTokenId: 0,
    };
  },
  computed: {
    ...mapState(["walletAddress"]),
  },
  mounted: async function () {
  },
  methods: {
    checkReward: async function() {
      const owner = await this.$ethereumService.ownerOf(this.selectedTokenId)
      if(owner.toLowerCase() != this.walletAddress){
        console.log('not owner')
        return this.$store.dispatch('showSnackbar', {show: true, text: "this token is not your own or staked"})
      }

      this.reward = await this.$ethereumService.rewards(this.selectedTokenId)
    },
    withdraw: async function() {
      const owner = await this.$ethereumService.ownerOf(this.selectedTokenId)
      if(owner.toLowerCase() != this.walletAddress){
        console.log('not owner')
        return this.$store.dispatch('showSnackbar', {show: true, text: "this token is not your own or staked"})
      }

      await this.$ethereumService.withdrawReward(this.selectedTokenId)
    },
  },
};
</script>

<style scoped lang="scss">
</style>
