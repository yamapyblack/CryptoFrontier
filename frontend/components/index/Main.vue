<template>
  <main>
    <div class="mt-8 mb-4 h-128 w-full overflow-y-scroll overflow-x-scroll relative">
      <!-- <div v-for="i in frontiers" class="h-18 absolute w-60" > -->
      <div v-for="i in frontiers" v-bind:class="classFrontier(i)" class="h-18 absolute w-60">
        <template v-if="frontierTokens[i]">
          <div v-if="frontierTokens[i].tokenIdA > 0" class="absolute top-3/5 left-1/3 font-bold text-black">{{ frontierTokens[i].tokenIdA }}</div>
          <div v-if="frontierTokens[i].tokenIdB > 0" class="absolute top-3/5 right-1/3 font-bold text-black">{{ frontierTokens[i].tokenIdB }}</div>
        </template>
        <button @click="linkFrontier(i)">
          <img class="" :src="imgObject(i)" />
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {
  },
  data() {
    return {
      frontiers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
      leftPos: [5,4,6,3,5,7,2,4,6,8, 1, 3, 5, 7, 9, 2, 4, 6, 8, 3, 5, 7, 4, 6, 5],
      topPos: [1,2,2,3,3,3,4,4,4,4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9],
      frontierTokens: [],
    };
  },
  computed: {
    ...mapState(["walletAddress"]),
  },
  mounted: async function () {
    for(let i = 0; i < this.frontiers.length; i++){
      const frontierId = this.frontiers[i]
      const frontierToken = await this.$ethereumService.getFrontier(frontierId)
      this.$set(this.frontierTokens, frontierId, frontierToken)
    }
  },
  created() {
  },
  methods: {
    classFrontier: function(i) {
      const top = 't-' + this.topPos[i-1]
      const left = 'l-'  + this.leftPos[i-1]
      return { [top] : true, [left] : true}
    },
    imgObject: function (i) {
      return require('~/assets/img/diamond.png')
    },
    linkFrontier: function(i) {
      if(!this.$ethereumService.isLoginCorrectChain()){return}
      this.$router.push(`/frontier/${i}`)
    },
  },
};
</script>

<style scoped lang="scss">
.t-1{
  top: 0;
}
.t-2{
  top: 5rem * 1;
}
.t-3{
  top: 5rem * 2;
}
.t-4{
  top: 5rem * 3;
}
.t-5{
  top: 5rem * 4;
}
.t-6{
  top: 5rem * 5;
}
.t-7{
  top: 5rem * 6;
}
.t-8{
  top: 5rem * 7;
}
.t-9{
  top: 5rem * 8;
}
.t-10{
  top: 5rem * 9;
}

.l-1{
  left: 0;
}
.l-2{
  left: 9rem * 1;
}
.l-3{
  left: 9rem * 2;
}
.l-4{
  left: 9rem * 3;
}
.l-5{
  left: 9rem * 4;
}
.l-6{
  left: 9rem * 5;
}
.l-7{
  left: 9rem * 6;
}
.l-8{
  left: 9rem * 7;
}
.l-9{
  left: 9rem * 8;
}
.l-10{
  left: 9rem * 9;
}
</style>
