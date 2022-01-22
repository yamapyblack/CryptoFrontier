<template>
  <div class="modal">
    <div class="modal__mask" />
    <div class="modal__wrapper">
      <div class="modal__container">
        <div class="text-right">
          <button class="p-2" @click="$emit('closeModal')">×</button>
        </div>        
        <div class="">FrontierID</div>
        <div class="">{{ frontierId }}</div>
        <div class="mt-6">TokenID</div>
        <div class="w-full">
          <!-- TODO ほんとはNFT一覧を取得してselectboxにしたい -->
          <!-- <select v-model="selectedTokenId" class="w-full bg-gray-800 p-1 border-none rounded">
            <option v-for="tokenId in tokenIds" v-bind:value="tokenId">{{ tokenId }}</option>
          </select> -->
          <input type="number" v-model.number="selectedTokenId"  placeholder="tokenID" class="w-full bg-gray-800 p-2 border-none rounded text-white">
        </div>

        <div class="mt-6 text-center">
          <button
            class="text-frontier border-solid border-2 rounded-xl border-frontier px-6 py-1 font-bold"
            :class="{ 'border-gray-500' : isApproved, 'text-gray-500' : isApproved }"
            @click="approve()">
            Approve
            </button>
        </div>
        <div class="mt-6 text-center">
          <button
            class="text-frontier border-solid border-2 rounded-xl border-frontier px-6 py-1 font-bold"
            :class="{ 'border-gray-500' : !isApproved, 'text-gray-500' : !isApproved }"
            @click="stake()">
          Stake
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ['frontierId'],
  data() {
    return {
      tokenIds: [1,2,3],
      selectedTokenId: 0,
      isApproved: false,
    }
  },
  computed: {
    ...mapState(["walletAddress"]),
  },
  async mounted() {
    this.isApproved = await this.$ethereumService.isApprovedForAll()
  },
  methods: {
    approve: async function() {
      if(this.isApproved){return}
      await this.$ethereumService.setApprovalForAll()
    },
    stake: async function() {
      if(!this.isApproved){return}
      const owner = await this.$ethereumService.ownerOf(this.selectedTokenId)
      if(owner.toLowerCase() != this.walletAddress){
        console.log('not owner')
        return this.$store.dispatch('showSnackbar', {show: true, text: "this token is not your own or staked"})
      }

      console.log('stake')
      await this.$ethereumService.stake(this.selectedTokenId, this.frontierId)
      this.$emit('closeModal')
    },
  },

}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &__mask {
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-backdrop-filter: blur(8px);
}

  &__wrapper {
    position: absolute;
    z-index: 9999;
    top: 0;
    left: 0;
    height: 100%;
    // padding: 2rem 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__container {
    background: black;
    border-radius: 0.2rem;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    max-width: 350px;
    width: 100%;
    padding: 2rem;
  }

}
</style>
