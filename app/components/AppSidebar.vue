<template>
  <div class="w-full flex flex-col gap-3 px-3 py-3 h-full">
    <nuxt-link to="/" class="inline-flex items-center gap-2">
      <img src="/logo.svg" width="24" height="24" />
      <span class="text-md font-medium">Bugmuggle</span>
    </nuxt-link>

    <UVerticalNavigation :ui="{ base: 'gap-3', padding: 'px-3 py-1.5' }" :links="userMenu" />

    <div class="z-10 sticky top-0 bg-neutral-900">
      <UInput placeholder="Search channels" />
    </div>

    <div>
      <label class="text-xs text-gray-400">Channels</label>
    </div>

    <UVerticalNavigation :ui="{ base: 'gap-3', padding: 'px-3 py-1.5' }" :links="channelMenu" />
    <UButton color="gray" size="xs" label="Create Channel" variant="ghost" icon="i-heroicons-plus" />

    <div class="grow" />

    <UDropdown :items="accountMenu" :popper="{ placement: 'bottom-start' }">
      <account-btn />
    </UDropdown>
  </div>
</template>

<script setup>
import { useChannelStore } from '~/store/channel'

const router = useRouter()
const channelStore = useChannelStore()

const userMenu = [
  {
    label: 'My Tasks',
    icon: 'i-heroicons-inbox',
    to: '/my-tasks'
  }
]

const accountMenu = ref([
  [
    {
      label: 'Account Settings',
      icon: 'i-heroicons-cog-6-tooth',
      click: () => {}
    }
  ],
  [
    {
      label: 'GitHub',
      click: () => {}
    },
    {
      label: 'Help & Feedback',
      click: () => {}
    },
    {
      label: 'Report an issue',
      click: () => {}
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      click: () => router.push({ path: '/logout' })
    }
  ]
])

const channelMenu = computed(() => {
  return channelStore.channels.map((channel) => ({
    label: channel.name,
    to: `/channel/${channel.id}`
  }))
})

onMounted(async () => {
  await channelStore.fetchChannels()
})
</script>
