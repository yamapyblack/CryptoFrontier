<template>
  <div class="character">
    <div class="flex">
      <div class="w-1/2">
        <img :src="svg" />
      </div>
      <div class="w-1/2 pl-2">
        <div class="font-bold">{{ tokenName }}</div>
        <!-- <div class="">#{{ tokenId }}</div> -->
        <div class="">Owner:</div>
        <div class="">{{ $ethereumService.shortenAddr(ownerAddr) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tokenId", "ownerAddr"],
  data() {
    return {
      tokenName: "",
      svg: "",
    }
  },
  mounted: async function () {
    this.tokeURI(this.svg)
  },
  methods: {
    tokeURI: async function() {
      const tokenURIA = await this.$ethereumService.tokenURI(this.tokenId);
      console.log(tokenURIA)

      const ta1 = tokenURIA.split(",")[1]
      const ta2 = await this.$ethereumService.decode(ta1)
      const ta3 = JSON.parse(ta2);
      this.tokenName = ta3.name
      this.svg = ta3.image
    },
  },
};
</script>
