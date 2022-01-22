<template>
  <div class="hp">
    <div class="flex justify-between" :class="isReverse">
      <div class="pt-2">{{ battleHp }} / {{ mapHp }}</div>
      <div class="text-2xl font-bold">
        <template v-if="!isBattleNow">
          <span v-if="battleHp == 0" class="text-gray-500">Lose</span>
          <span v-else class="text-frontier">Win</span>
        </template>
      </div>
    </div>

    <HpBar
      :battleHp="battleHp"
      :hp="mapHp"
    />

    <div class="flex justify-between mt-2" :class="isReverse">
      <div class="pt-2">DeadBlock</div>
      <div class="text-2xl">
        <span v-if="battleHp == 0">{{ deadBlock }}</span>
        <span v-else="battleHp == 0">-</span>
      </div>
    </div>
  </div>
</template>

<script>
import HpBar from "~/components/utils/HpBar.vue";

export default {
  components: {
    HpBar,
  },
  props: ["isBattleNow", "battleHp", "mapHp", "deadBlock", "isA"],
  data() {
    return{
    }
  },
  computed: {
    isReverse: function () {
      return {
        'flex-row-reverse': !this.isA,
      }
    }
  },
  methods: {
    styleWidth: function(battleHp, hp){
      const rate = Math.round(battleHp / hp * 100)      
      return{
        width: rate + "%",
      }      
    },
  }
};
</script>
