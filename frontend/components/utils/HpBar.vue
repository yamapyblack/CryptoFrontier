<template>
  <div class="hp-bar">
    <div class="pt-1">
      <div class="mb-4">
        <div class="overflow-hidden h-2 rounded bg-pink-100">
          <div :style="styleWidth()" class="overflow-hidden h-2 rounded bg-pink-500"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["battleHp", "hp"],
  data() {
    return{
    }
  },
  methods: {
    styleWidth: function(){
      const rate = Math.round(this.battleHp / this.hp * 100)      
      return{
        width: rate + "%",
      }      
    },
  }
};
</script>
