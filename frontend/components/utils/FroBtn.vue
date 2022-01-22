<template>
  <div class="button">
    <button
      class="text-frontier border-solid border-2 rounded-xl border-frontier px-6 py-1 font-bold"
      @click="$emit('clickBtn')"
    >
      {{ text }}
    </button>
  </div>
</template>

<script>
export default {
  props: ["text"],
};
</script>
