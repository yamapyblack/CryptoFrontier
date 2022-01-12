<template>
  <div class="hp">
    <div class="flex justify-between">
      <template v-if="isA">
        <div class="pt-2">{{ battleHp }} / {{ mapHp }}</div>
        <div class="text-2xl font-bold">
          <span v-if="battleHp == 0" class="text-gray-500">Lose</span>
          <span v-else="battleHp == 0" class="text-frontier">Win</span>
        </div>
      </template>
      <template v-else>
        <div class="text-2xl font-bold">
          <span v-if="battleHp == 0" class="text-gray-500">Lose</span>
          <span v-else="battleHp == 0" class="text-frontier">Win</span>
        </div>
        <div class="pt-2">{{ battleHp }} / {{ mapHp }}</div>
      </template>
    </div>

    <div class="relative pt-1">
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-100">
        <div
          :style="styleWidth()"
          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
        ></div>
      </div>
    </div>
    <div class="flex justify-between mt-2">
      <template v-if="isA">
        <div class="pt-2">DeadBlock</div>
        <div class="text-2xl">
          <span v-if="battleHp == 0">{{ deadBlock }}</span>
          <span v-else="battleHp == 0">-</span>
        </div>
      </template>

      <template v-else>
        <div class="text-2xl">
          <span v-if="battleHp == 0">{{ deadBlock }}</span>
          <span v-else="battleHp == 0">-</span>
        </div>
        <div class="pt-2">DeadBlock</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ["battleHp", "mapHp", "deadBlock", "isA"],
  data() {
    return{
      styleObject: {
        width: "80%",
      }
    }
  },
  methods: {
    styleWidth: function(){
      const rate = Math.round(this.battleHp / this.mapHp * 100)      
      return{
        width: rate + "%",
      }      
    },
  }
};
</script>
