<template>
  <div class="container mx-auto">
    <div class="flex justify-between mt-6">
      <div class="w-32 font-bold">
        <span class="text-xl">F</span>rontier No.
        <span class="text-xl">{{ $route.params.id }}</span>
      </div>
      <div v-if="!isBattleNow" class="w-32 text-right">
        <FroBtn              
          :text="'Stake'"
          @clickBtn="showStakeModal()"
        />
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <!-- black left -->
      <template v-if="frontier.tokenIdA > 0">
        <div class="w-5/12 bg-black/[.5] p-8">

          <Character
            :tokenId="frontier.tokenIdA"
            :ownerAddr="stakerA.staker"
          />

          <div class="mt-6">
            <hp
              :isBattleNow="isBattleNow"
              :battleHp="bothBattleHp.hpA"
              :mapHp="statusA.hp"
              :deadBlock="bothBattleHp.deadBlock"
              :isA="true"
            />
          </div>

          <div class="mt-10">
            <status :statusParam="statusA" />
          </div>

          <div class="mt-12 text-center">
            <FroBtn              
              v-if="canUnStake(stakerA.staker)"
              :text="'UnStake'"
              @clickBtn="unStake(frontier.tokenIdA)"
            />

          </div>
        </div>
        <!-- black left -->
      </template>

      <!-- black right -->
      <template v-if="frontier.tokenIdB > 0">
        <div class="w-5/12 bg-black/[.5] p-8">
          <Character
            :tokenId="frontier.tokenIdB"
            :ownerAddr="stakerB.staker"
          />

          <div class="mt-6">
            <hp
              :isBattleNow="isBattleNow"
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
            <FroBtn              
              v-if="canUnStake(stakerB.staker)"
              :text="'UnStake'"
              @clickBtn="unStake(frontier.tokenIdB)"
            />

          </div>
        </div>
        <!-- black right -->
      </template>
    </div>

    <StakeModal
      v-if="isModal"
      :frontierId="frontierId"
      @closeModal="closeModal"
    >
    </StakeModal>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Web3 from "web3";
import StakeModal from "~/components/frontier/StakeModal.vue";
import Status from "~/components/utils/Status.vue";
import Character from "~/components/utils/Character.vue";
import Hp from "~/components/frontier/Hp.vue";
import FroBtn from "~/components/utils/FroBtn.vue";

export default {
  components: {
    StakeModal,
    Status,
    Character,
    Hp,
    FroBtn,
  },
  data() {
    return {
      frontierId: 0,
      isModal: false,
      bothBattleHp: {},
      isBattleNow: false,
      frontier: {},
      stakerA: { staker: "0x" },
      statusA: {},
      stakerB: { staker: "0x" },
      statusB: {},
    };
  },
  computed: {
    ...mapState(["walletAddress"]),
  },
  mounted: async function () {
    console.log("mounted", this.$route.params.id);

    this.frontierId = this.$route.params.id;
    if (!this.walletAddress) {
      console.log("please login");
      return;
    }

    const frontier = await this.$ethereumService.getFrontier(this.frontierId);
    console.log("frontier", frontier);
    this.frontier = frontier;

    const bothBattleHp = await this.$ethereumService.getBothBattleHp(
      this.frontierId
    );
    console.log("bothBattleHp", bothBattleHp);
    this.bothBattleHp = bothBattleHp;

    this.isBattleNow = (this.bothBattleHp.hpA > 0 && this.bothBattleHp.hpB > 0)

    if (this.frontier.tokenIdA > 0) {
      const stakerA = await this.$ethereumService.getStake(
        this.frontier.tokenIdA
      );
      console.log("stakerA", stakerA);
      this.stakerA = stakerA;

      const statusA = await this.$ethereumService.getStatus(
        this.frontier.tokenIdA
      );
      console.log("statusA", statusA);
      this.statusA = statusA;

    }

    if (this.frontier.tokenIdB > 0) {
      const stakerB = await this.$ethereumService.getStake(
        this.frontier.tokenIdB
      );
      console.log("stakerB", stakerB);
      this.stakerB = stakerB;

      const statusB = await this.$ethereumService.getStatus(
        this.frontier.tokenIdB
      );
      console.log("statusB", statusB);
      this.statusB = statusB;
    }
  },
  created() {},
  methods: {
    showStakeModal: function () {
      this.isModal = true;
    },
    canUnStake: function (staker) {
      if (this.isBattleNow) {
        return false;
      }
      if (staker.toLowerCase() != this.walletAddress.toLowerCase()) {
        return false;
      }
      return true;
    },
    unStake: async function(_tokenId){
      await this.$ethereumService.unStake(_tokenId)
    },
    closeModal: function () {
      this.isModal = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
