<template>
  <div class="w-full flex flex-col gap-3 px-3 py-3 h-full">
    <nuxt-link to="/" class="inline-flex items-center gap-2">
      <img src="/logo.svg" width="24" height="24" />
      <span class="text-md font-medium">Bugmuggle</span>
    </nuxt-link>

    <UVerticalNavigation :ui="{ base: 'gap-3', padding: 'px-3 py-1.5' }" :links="userMenu" />

    <div class="z-10 sticky top-0 bg-neutral-900">
      <UInput v-model="searchQuery" placeholder="Search channels" />
    </div>

    <div>
      <label class="text-xs text-gray-600">Channels</label>
    </div>

    <UVerticalNavigation :ui="{ base: 'gap-3', padding: 'px-3 py-1.5' }" :links="channelMenu" />
    <UButton color="gray" size="xs" label="Create Channel" variant="ghost" icon="i-heroicons-plus" @click="() => refCreateChannel.open()" />

    <div class="grow" />

    <UDropdown :items="accountMenu" :popper="{ placement: 'bottom-start' }">
      <account-btn />
    </UDropdown>
  </div>

  <DialogsCreateChannel ref="refCreateChannel" />
  <DialogsLogout ref="refLogoutDialog" />
</template>

<script setup>
import { useChannelStore } from '~/store/channel'

const router = useRouter()
const route = useRoute()
const channelStore = useChannelStore()
const refCreateChannel = ref(null)
const searchQuery = ref('')
const refLogoutDialog = ref(null)

const cid = route.params.cid

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
      click: () => window.open('https://github.com/bugmuggle/bugmuggle', '_blank'),
    },
    {
      label: 'Help & Feedback',
      click: () => {}
    },
    {
      label: 'Report an issue',
      click: () => window.open('https://github.com/bugmuggle/bugmuggle/issues/new', '_blank'),
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-start-on-rectangle',
      click: () => refLogoutDialog.value.open(),
    }
  ]
])

const channelMenu = computed(() => {
  const channels = channelStore.channels
  if (!searchQuery.value) {
    return channels.map(channel => ({
      label: channel.name,
      to: `/channel/${channel.id}`,
    }))
  }

  return channels
    .filter(channel =>
      channel.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
    .map(channel => ({
      label: channel.name,
      to: `/channel/${channel.id}`,
    }))
})

onMounted(async () => {
  await channelStore.fetchChannels()
  await channelStore.getUsers(cid)
})
</script>
