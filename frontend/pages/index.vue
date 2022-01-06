<template>
  <div class="container mx-auto">
    <main>
      <div class="mt-8 mb-4 h-128 w-full overflow-y-scroll overflow-x-scroll relative">
        <!-- <div v-for="i in frontiers" class="h-18 absolute w-60" > -->
        <div v-for="i in frontiers" v-bind:class="classFrontier(i)" class="h-18 absolute w-60">
          <nuxt-link :to="`/frontier/${i}`">
            <img class="" :src="imgObject(i)" />
          </nuxt-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
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
    classObject: function () {
      return {
        active: this.isActive && !this.error,
        'text-danger': this.error && this.error.type === 'fatal'
      }
    },
  },
  // ページ読み込み時にタイル状に表示させる
  mounted: function () {
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
      return require('../assets/img/diamond.png')
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
