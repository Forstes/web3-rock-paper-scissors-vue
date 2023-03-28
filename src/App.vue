<script setup lang="ts">
import router from "@/plugins/router";
import { address, balance } from "@/scripts/wallet";
import { ClipboardIcon } from "@heroicons/vue/24/outline";

function copyAddress() {
  navigator.clipboard.writeText(address.value);
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-gray-50">
    <nav class="sticky z-20 border-gray-200 px-4 py-2.5 bg-gray-100">
      <div class="flex flex-wrap items-center justify-between">
        <a class="cursor-pointer">
          <span
            class="font-bold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
            @click="router.push('/')"
            >RPS</span
          >
        </a>

        <div class="w-auto flex items-center gap-3 cursor-pointer" @click="router.push('/')">
          <ClipboardIcon class="w-7 h-7 p-1 border rounded-md active:border-2 hover:bg-gray-200" @click="copyAddress" />
          <span class="w-36 truncate text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600">{{ address }}</span>
          <span class="p-2 border rounded-lg bg-purple-400 hover:bg-purple-500 text-white">{{ balance }} tBNB</span>
        </div>
      </div>
    </nav>

    <main class="grow overflow-auto p-2">
      <router-view />
    </main>
  </div>
</template>
