
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
          <!-- TODO ownerAddr -->
          <Character
            :tokenId="stakedToken.identifier"
            :ownerAddr="''" 
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
    const nfts1 = await this.getNfts(stakingAddr)
    console.log(nfts1)
    if(nfts1.account){
      this.setStakedToken(nfts1.account.ERC721tokens)
    }

    // not staked
    const nfts2 = await this.getNfts(this.walletAddress)
    console.log(nfts2)
    if(nfts2.account){
      this.setOwnedToken(nfts2.account.ERC721tokens)
    }
  },
  methods: {
    async getNfts(_account){
      const res = await this.$apollo.query({
        query: query,
        variables: {
          account: _account,
        }
      })
      return res.data
    },
    async setStakedToken(_tokens){
      const stakedTokens = _tokens

      for(let i = 0; i < stakedTokens.length; i++){
        stakedTokens[i].status = await this.$ethereumService.getStatus(
          stakedTokens[i].identifier
        );
        stakedTokens[i].staked = await this.$ethereumService.getStake(
          stakedTokens[i].identifier
        );
        this.stakedTokens.push(stakedTokens[i])
      }

    },
    async setOwnedToken(_tokens){
      const tokens = _tokens

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
