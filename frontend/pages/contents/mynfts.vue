
<template>
  <div class="container mx-auto">
    <div class="flex justify-between mt-6">
      <div class="w-32 font-bold">
        <span class="text-xl">M</span>y charcters
      </div>
    </div>

    <h3 class="mt-8">Staked</h3>
    <div class="flex mt-4 overflow-x-scroll">
      <template v-for="stakedToken in stakedTokens">
        <!-- black -->
        <div class=" m-6 bg-black/[.5] p-8">
          <Character
            :tokenId="stakedToken.identifier"
            :ownerAddr="walletAddress"
          />

          <div class="mt-6">
            <div class="flex justify-between mt-2">
              <div class="pt-1">FrontierID</div>
                <div class="text-xl" @click="linkFrontier(stakedToken.staked.frontierId)">
                  <button>{{ stakedToken.staked.frontierId }}</button>
                </div>
            </div>
          </div>

          <div class="mt-10">
            <status :statusParam="stakedToken.status" />
          </div>
        </div><!-- black -->
      </template>
    </div>

    <h3 class="mt-8">Not Staked</h3>
    <div class="flex mt-4 overflow-x-scroll">

      <template v-for="token in tokens">
        <!-- black -->
        <div class=" m-6 bg-black/[.5] p-8">
          <Character
            :tokenId="token.identifier"
            :ownerAddr="walletAddress"
          />

          <div class="mt-6">
            <div class="flex justify-between">
              <div class="pt-2">{{ token.battleHp.hp }} / {{ token.status.hp }}</div>
              <div class="text-2xl font-bold">
              </div>
            </div>

            <HpBar
              :battleHp="token.battleHp.hp"
              :hp="token.status.hp"
            />

            <div class="flex justify-between mt-2">
              <div class="pt-1">Block</div>
              <div class="text-xl">
                <span>{{ token.battleHp.blockNumber }}</span>
              </div>
            </div>
          </div>

          <div class="mt-10">
            <status :statusParam="token.status" />
          </div>

          <div class="mt-12 text-center">
            <FroBtn
              v-if="token.canRevive"
              :text="'Revive'"
              @clickBtn="revive(token.identifier)"
            />
          </div>
        </div><!-- black -->
      
      </template>      
    </div>

  </div>
</template>

<script>
import "vue-apollo";
import query from "~/apollo/queries/erc721tokens.gql";
import { mapState } from "vuex";
import Status from "~/components/utils/Status.vue";
import Character from "~/components/utils/Character.vue";
import HpBar from "~/components/utils/HpBar.vue";
import FroBtn from "../../components/utils/FroBtn.vue";

export default {
  components: {
    Status,
    Character,
    HpBar,
    FroBtn
},
  computed: {
    ...mapState(["walletAddress"]),
  },
  data() {
    return {
      stakedTokens: [],
      tokens: [],
    };
  },
  mounted: async function() {
    //staked
    const stakingAddr = process.env.FROStaking.toLowerCase()
    const res0 = await this.$apollo.query({
      query: query,
      variables: {
        account: stakingAddr,
      }
    })
    console.log(res0.data.account)
    const stakedTokens = res0.data.account.ERC721tokens

    for(let i = 0; i < stakedTokens.length; i++){
      stakedTokens[i].status = await this.$ethereumService.getStatus(
        stakedTokens[i].identifier
      );
      stakedTokens[i].staked = await this.$ethereumService.getStake(
        stakedTokens[i].identifier
      );
      this.stakedTokens.push(stakedTokens[i])
    }

    // not staked
    const res = await this.$apollo.query({
      query: query,
      variables: {
        account: this.walletAddress,
      }
    })
    console.log(res.data.account)
    const tokens = res.data.account.ERC721tokens

    for(let i = 0; i < tokens.length; i++){
      tokens[i].status = await this.$ethereumService.getStatus(
        tokens[i].identifier
      );
      tokens[i].battleHp = await this.$ethereumService.getHp(
        tokens[i].identifier
      );
      tokens[i].canRevive = await this.$ethereumService.canRevive(
        tokens[i].identifier
      );

      this.tokens.push(tokens[i])
    }
  },
  methods: {
    styleWidth: function(battleHp, hp){
      const rate = Math.round(battleHp / hp * 100)      
      return{
        width: rate + "%",
      }      
    },
    revive: async function(_tokenId){
      await this.$ethereumService.revive(_tokenId);
    },
    linkFrontier: function(i) {
      this.$router.push(`/frontier/${i}`)
    },

  },

  // apollo: {
  //   account: {
  //     prefetch: true,
  //     query: query,
  //     variables: {
  //       account: this.walletAddress,
  //     }
  //   }
  // },  
};
</script>
