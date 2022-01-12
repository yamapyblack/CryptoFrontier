<template>
  <div class="container mx-auto">
    <div class="flex justify-between mt-6">
      <div class="w-32 font-bold"><span class="text-xl">F</span>rontier No. <span class="text-xl">{{$route.params.id}}</span></div>
      <div v-if="!isBattleNow()" class="w-32 text-right">
        <button class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold" @click="showStakeModal()">
        Stake
        </button>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      
      <!-- black left -->
      <template v-if="frontier.tokenIdA > 0" >
        <div class="w-5/12 bg-black/[.5] p-8">
          <div class="flex">
            <div class="w-80"><img class="w-full" src="~/assets/img/charactor_sample1.png" alt="" /></div>
            <div class="pl-4 pt-4">
              <div class="font-bold">A</div>
              <div class="">#{{ frontier.tokenIdA }}</div>
              <div class="">Owner:</div>
              <div class="">{{ shortenAddr2(stakerA.staker) }}</div>
            </div>
          </div>

          <div class="mt-6">
            <hp
              :battleHp="bothBattleHp.hpA"
              :mapHp="statusA.hp"
              :deadBlock="bothBattleHp.deadBlock"
              :isA="true"
              />
          </div>

          <div class="mt-10">
            <status :statusParam="statusA" />
          </div>

          <!-- unstake button -->
          <div class="mt-12 text-center">
            <button v-if="stakerA.staker.toLowerCase() == walletAddress.toLowerCase()" class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold">unStake</button>
          </div>

        </div><!-- black left -->
      </template>

      <!-- black right -->
      <template v-if="frontier.tokenIdB > 0" >
        <div class="w-5/12 bg-black/[.5] p-8">
          <div class="flex">
            <div class="w-80"><img class="w-full" src="~/assets/img/charactor_sample1.png" alt="" /></div>
            <div class="pl-4 pt-4">
              <div class="font-bold">B</div>
              <div class="">#{{ frontier.tokenIdB }}</div>
              <div class="">Owner:</div>
              <div class="">{{ shortenAddr2(stakerB.staker) }}</div>
            </div>
          </div>

          <div class="mt-6">
            <hp
              :battleHp="bothBattleHp.hpB"
              :mapHp="statusB.hp"
              :deadBlock="bothBattleHp.deadBlock"
              :isA="false"
              />
          </div>

          <div class="mt-10">
            <status :statusParam="statusB" />
          </div>

          <!-- unstake button -->
          <div class="mt-12 text-center">
              <button v-if="stakerB.staker.toLowerCase() == walletAddress.toLowerCase()" class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold">unStake</button>
          </div>

        </div><!-- black right -->
      </template>

    </div>

    <modal
      v-if="isModal"
      :frontierId="frontierId"
      @closeModal="closeModal"
      >
    </modal>

  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Web3 from "web3";
import Modal from "~/components/Modal.vue"
import Status from "~/components/frontier/Status.vue"
import Hp from "~/components/frontier/Hp.vue"

const tokenId = 1;

export default {
  components: {
    Modal,Status,Hp
  },
  data() {
    return {
      frontierId: 0,
      isModal: false,
      bothBattleHp: {},
      frontier: {},
      stakerA: {staker: '0x'},
      statusA: {},
      stakerB: {staker: '0x'},
      statusB: {},
    };
  },
  computed: {
    ...mapState(["walletAddress"]),
  },
  mounted: async function () {
    console.log('mounted', this.$route.params.id)

    this.frontierId = this.$route.params.id
    if(!this.walletAddress){
      console.log('please login')
      return
    }

    const frontier = await this.$ethereumService.getFrontier(this.frontierId)
    console.log('frontier', frontier)
    this.frontier = frontier

    const bothBattleHp = await this.$ethereumService.getBothBattleHp(this.frontierId)
    console.log('bothBattleHp', bothBattleHp)
    this.bothBattleHp = bothBattleHp

    if(this.frontier.tokenIdA > 0){
      const stakerA = await this.$ethereumService.getStake(this.frontier.tokenIdA)
      console.log('stakerA', stakerA)
      this.stakerA = stakerA

      const statusA = await this.$ethereumService.getStatus(this.frontier.tokenIdA)
      console.log('statusA', statusA)
      this.statusA = statusA
    }

    if(this.frontier.tokenIdB > 0){
      const stakerB = await this.$ethereumService.getStake(this.frontier.tokenIdB)
      console.log('stakerB', stakerB)
      this.stakerB = stakerB

      const statusB = await this.$ethereumService.getStatus(this.frontier.tokenIdB)
      console.log('statusB', statusB)
      this.statusB = statusB
    }
  },
  created() {
  },
  methods: {
    showStakeModal: function(){
      this.isModal = true;
    },
    // getBothBattleHp: async function() {
    //   return await this.$ethereumService.getBothBattleHp()
    // },
    shortenAddr2: function(addr) {
      if(addr.length < 16){return addr}
      return addr.slice(0, 16) + '...';
    },
    isBattleNow: function(){
      if(this.bothBattleHp.hpA > 0 && this.bothBattleHp.hpB > 0){return true}
    },
    canUnStake: function(isA) {
      if(this.isBattleNow()){return false}
      if(isA){
        if(this.stakerA.staker == this.walletAddress){return true}
      }else{
        if(this.stakerB.staker == this.walletAddress){return true}
      }
      return false
    },
    closeModal: function() {
      this.isModal = false
    }

  },
};
</script>

<style scoped lang="scss">
</style>
