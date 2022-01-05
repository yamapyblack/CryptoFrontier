<script setup lang="ts">
const { $hello, $wallet, $isConnect, $getBalance } = useNuxtApp()
// $hello.log()

// console.log(process.env.NODE_DEBUG);

</script>

<template>
  <div class="container mx-auto">
    <div class="flex justify-between mt-6">
      <div class="w-32 font-bold"><span class="text-xl">F</span>rontier No. <span class="text-xl">{{$route.params.id}}</span></div>
      <div class="w-32 text-right">
        <button class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold" @click="$wallet.stake2()">Stake</button>
      </div>
    </div>

    <div class="flex justify-between mt-6">
      <!-- black left -->
      <div class="w-5/12 bg-black/[.5] p-8">
        <div class="flex">
          <div class="w-80"><img class="w-full" src="/img/charactor_sample1.png" alt="" /></div>
          <div class="pl-4 pt-4">
            <div class="font-bold">Hoge</div>
            <div class="">#88888</div>
            <div class="">Owner:</div>
            <div class="">{{ $wallet.shortenAddr("0xCDF4f278c469Fd3961707D6b4D54B8f244eA5d9E") }}</div>
          </div>
        </div>

        <!-- hp -->
        <div class="">
          <div class="flex justify-between mt-6">
            <div class="pt-2">0 / 200</div>
            <div class="text-2xl font-bold">Lose</div>
          </div>

          <div class="relative pt-1">
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-100">
              <div class="w-3/10 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <div class="pt-2">DeadBlock</div>
            <div class="text-2xl">21212121</div>
          </div>
        </div>

        <!-- status -->
        <div class="mt-10">
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Hp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">It</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">At</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">Sp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Df</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
        </div>

        <!-- button -->
        <div class="mt-12 text-center">
          <button class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold">unStake</button>
        </div>

      </div><!-- black left -->

      <!-- black right -->
      <div class="w-5/12 bg-black/[.5] p-8">
        <div class="flex">
          <div class="w-80"><img class="w-full" src="/img/charactor_sample1.png" alt="" /></div>
          <div class="pl-4 pt-4">
            <div class="font-bold">Hoge</div>
            <div class="">#88888</div>
            <div class="">Owner:</div>
            <div class="">{{ $wallet.shortenAddr("0xCDF4f278c469Fd3961707D6b4D54B8f244eA5d9E") }}</div>
          </div>
        </div>

        <!-- hp -->
        <div class="">
          <div class="flex justify-between mt-6">
            <div class="pt-2">0 / 200</div>
            <div class="text-2xl font-bold">Win</div>
          </div>

          <div class="relative pt-1">
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-100">
              <div class="w-3/10 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"></div>
            </div>
          </div>
          <div class="flex justify-between mt-2">
            <div class="pt-2">DeadBlock</div>
            <div class="text-2xl">21212121</div>
          </div>
        </div>

        <!-- status -->
        <div class="mt-10">
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Hp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">It</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">At</div>
              <div class="w-1/2 text-right">200</div>
            </div>
            <div class="w-1/2 flex pl-4">
              <div class="w-1/2">Sp</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="w-1/2 flex pr-4">
              <div class="w-1/2">Df</div>
              <div class="w-1/2 text-right">200</div>
            </div>
          </div>
        </div>

        <!-- button -->
        <div class="mt-12 text-center">
          <button class="text-frontier border-2 rounded-xl border-frontier px-6 py-1 font-bold">unStake</button>
        </div>

      </div><!-- black right -->

    </div>


  </div>
</template>

<style scoped lang="scss">
</style>
