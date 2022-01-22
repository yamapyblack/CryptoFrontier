<template>
  <div class="status">
    <div class="flex justify-between">
      <div class="w-1/2 flex pr-4">
        <div class="w-1/2">Hp</div>
        <div class="w-1/2 text-right">{{ statusParam.hp }}</div>
      </div>
      <div class="w-1/2 flex pl-4">
        <div class="w-1/2">It</div>
        <div class="w-1/2 text-right">{{ statusParam.it }}</div>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="w-1/2 flex pr-4">
        <div class="w-1/2">At</div>
        <!-- .atは予約語になっているため配列で取得 -->
        <div class="w-1/2 text-right">{{ statusParam[1] }}</div>
      </div>
      <div class="w-1/2 flex pl-4">
        <div class="w-1/2">Sp</div>
        <div class="w-1/2 text-right">{{ statusParam.sp }}</div>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="w-1/2 flex pr-4">
        <div class="w-1/2">Df</div>
        <div class="w-1/2 text-right">{{ statusParam.df }}</div>
      </div>
      <div class="w-1/2 flex pl-4">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["statusParam"],
};
</script>
