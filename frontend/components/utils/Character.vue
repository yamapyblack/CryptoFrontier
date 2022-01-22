<template>
  <div class="character">
    <div class="flex">
      <!-- <div class="w-80">
        <img
          class="w-full"
          src="~/assets/img/charactor_sample1.png"
          alt=""
        />
      </div> -->
      <div class="pl-4 pt-4">
        <!-- <div class="font-bold">A</div> -->
        <div class="">#{{ tokenId }}</div>
        <div class="">Owner:</div>
        <div class="">{{ $ethereumService.shortenAddr(ownerAddr) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tokenId", "ownerAddr"],
};
</script>
