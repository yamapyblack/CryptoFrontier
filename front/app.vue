<script setup lang="ts">
const walletAddress = useState('walletAddress', () => "")
</script>

<template>
  <div class="container mx-auto">
    <header class="flex mt-4">
      <div class="w-7/12">
        <nuxt-link to="/">
          <img class="w-full" src="/img/logo.png" />
        </nuxt-link>
      </div>
      <div class="flex flex-row-reverse w-5/12 mt-8">
        <div class="ml-6">Rewards</div>
        <div class="ml-6">MyNFTs</div>
        <div v-if="walletAddress" class="ml-6">{{ $wallet.shortenAddr(walletAddress) }}</div>        
        <div v-else class="ml-6" @click="$wallet.connect()">Connect</div>
      </div>
    </header>
    <NuxtPage/>
    <footer class="mt-12">
      <div class="flex justify-center">
        <div class="m-4">利用規約</div>
        <div class="m-4">プライバシーポリシー</div>
        <div class="m-4">運営会社</div>
      </div>
      <div class="flex justify-center mb-4">© 2021 FrontierDAO</div>
    </footer>
  </div>
</template>