<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <p class="text-sm font-medium">
            Manage Channel Members
          </p>

          <div class="grow" />

          <UPopover v-model:open="openAddUserPopover">
            <UButton icon="i-heroicons-plus" label="Add Member" size="xs" variant="soft" />

            <template #panel>
              <div class="p-4 space-y-2">
                <UInput v-model="inputGithubUsername" label="GitHub Username" placeholder="Enter GitHub Username" />

                <UButton label="Continue" block size="xs" variant="solid" @click="addMember()" />
              </div>
            </template>
          </UPopover>
        </div>
      </template>

      <div class="h-full max-h-[500px] overflow-y-auto">
        <div class="flex flex-col gap-2">
          <div v-for="member in members" :key="'member-manage-channel-dialog-' + member.id" class="flex items-center gap-2">
            <UAvatar size="xs" :src="member.githubAvatarUrl" />
            <p class="text-sm">
              {{ member.githubUsername }}
            </p>

            <div class="grow" />

            <UButton icon="i-heroicons-trash" size="xs" color="gray" variant="ghost" @click="() => deleteMember(-1)" />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" size="xs" label="Close" variant="ghost" @click="close" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useChannelStore } from '~/store/channel'

const route = useRoute()
const isOpen = ref(false)
const openAddUserPopover = ref(false)
const channelStore = useChannelStore()
const cid = route.params.cid
const inputGithubUsername = ref('')

const members = computed(() => channelStore.members)

const deleteMember = async (memberId) => {
  // await channelStore.deleteMember(cid, memberId)
} 

const addMember = async () => {
  await channelStore.addMember(cid, inputGithubUsername.value)
}

const open = () => {
  isOpen.value = true
  channelStore.getUsers(cid)
}

const close = () => {
  isOpen.value = false
}

watch(openAddUserPopover, (value) => {
  if (!value) {
    inputGithubUsername.value = ''
  }
})

defineExpose({
  open,
  close,
})
</script>
