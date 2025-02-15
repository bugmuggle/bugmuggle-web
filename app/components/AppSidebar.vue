<template>
  <div class="w-full flex flex-col gap-3 px-3 py-3">
    <nuxt-link to="/" class="inline-flex items-center gap-2">
      <img src="/logo.svg" width="24" height="24" />
      <span class="text-md font-medium">Bugmulggle</span>
    </nuxt-link>

    <UVerticalNavigation :ui="{ base: 'gap-3', padding: 'px-3 py-1.5' }" :links="userMenu" />

    <div class="z-10 sticky top-0 bg-neutral-900">
      <UInput placeholder="Search channels" />
    </div>

    <div>
      <label class="text-xs text-gray-400">Channels</label>
    </div>

    <UVerticalNavigation :ui="{ base: 'gap-3', padding: 'px-3 py-1.5' }" :links="channelMenu" />
  </div>
</template>

<script setup>
const userMenu = [
  {
    label: 'My Tasks',
    icon: 'i-heroicons-inbox',
    to: '/my-tasks'
  }
]

const channelMenu = ref([])
</script>
