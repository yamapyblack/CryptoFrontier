<template>
  <div class="container mx-auto">
    <div class="flex justify-between mt-6">
      <div class="w-32 font-bold"><span class="text-xl">F</span>rontier No. <span class="text-xl">{{$route.params.id}}</span></div>
      <div class="w-32 text-right">
        <button class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold" @click="stake()">Stake</button>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <!-- black left -->
      <div class="w-5/12 bg-black/[.5] p-8">
        <div class="flex">
          <div class="w-80"><img class="w-full" src="~/assets/img/charactor_sample1.png" alt="" /></div>
          <div class="pl-4 pt-4">
            <div class="font-bold">Hoge</div>
            <div class="">#88888</div>
            <div class="">Owner:</div>
            <div class="">{{ shortenAddr2("0xCDF4f278c469Fd3961707D6b4D54B8f244eA5d9E") }}</div>
          </div>
        </div>

        <!-- hp -->
        <div class="">
          <div class="flex justify-between mt-6">
            <div class="pt-2">0 / 200</div>
            <div class="text-2xl font-bold">Lose</div>
          </div>

          <div class="relative pt-1">
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-100">
              <div class="w-3/10 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <div class="pt-2">DeadBlock</div>
            <div class="text-2xl">21212121</div>
          </div>
        </div>

        <!-- status -->
        <div class="mt-10">
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Hp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">It</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">At</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">Sp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Df</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
        </div>

        <!-- button -->
        <div class="mt-12 text-center">
          <button class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold">unStake</button>
        </div>

      </div><!-- black left -->

      <!-- black right -->
      <div class="w-5/12 bg-black/[.5] p-8">
        <div class="flex">
          <div class="w-80"><img class="w-full" src="~/assets/img/charactor_sample1.png" alt="" /></div>
          <div class="pl-4 pt-4">
            <div class="font-bold">Hoge</div>
            <div class="">#88888</div>
            <div class="">Owner:</div>
            <div class="">{{ shortenAddr2("0xCDF4f278c469Fd3961707D6b4D54B8f244eA5d9E") }}</div>
          </div>
        </div>

        <!-- hp -->
        <div class="">
          <div class="flex justify-between mt-6">
            <div class="pt-2">0 / 200</div>
            <div class="text-2xl font-bold">Win</div>
          </div>

          <div class="relative pt-1">
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-100">
              <div class="w-3/10 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <div class="pt-2">DeadBlock</div>
            <div class="text-2xl">21212121</div>
          </div>
        </div>

        <!-- status -->
        <div class="mt-10">
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Hp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">It</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">At</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">Sp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Df</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
        </div>

        <!-- button -->
        <div class="mt-12 text-center">
          <button class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold">unStake</button>
        </div>

      </div><!-- black right -->

    </div>


  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Web3 from "web3";

const logicAddr = "0x52a6a2698aE46ab26f4bec6136Ea89238b14D56c";
const tokenId = 1;
const logicAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "unStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default {
  components: {
  },
  data() {
    return {
      frontiers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
      leftPos: [5,4,6,3,5,7,2,4,6,8, 1, 3, 5, 7, 9, 2, 4, 6, 8, 3, 5, 7, 4, 6, 5],
      topPos: [1,2,2,3,3,3,4,4,4,4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9],
    };
  },
  computed: {
    ...mapState(["walletAddress"]),
  },
  mounted: async function () {
    if(!this.walletAddress){
      console.log('please login')
      return
    }
    //TODO yamaura
    const bothBattleHp = await this.$ethereumService.getBothBattleHp()
  },
  created() {
  },
  methods: {
    stake: async function() {
      return await this.$ethereumService.stake()
    },
    // getBothBattleHp: async function() {
    //   return await this.$ethereumService.getBothBattleHp()
    // },
    classFrontier: function(i) {
      console.log(i)
      const top = 't-' + this.topPos[i-1]
      const left = 'l-'  + this.leftPos[i-1]
      return { [top] : true, [left] : true}
    },
    shortenAddr2: function(addr) {
      return addr.slice(0, 16) + '...';
    },

  },
};
</script>

<style scoped lang="scss">
</style>
