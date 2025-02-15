<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        Create a new channel
      </template>

      <div class="space-y-3">
        <UInput v-model="name" label="Channel Name" placeholder="Enter channel name" />
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" size="xs" label="Cancel" variant="ghost" @click="close" />
          <UButton color="primary" size="xs" label="Create" variant="solid" @click="createChannel" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useChannelStore } from '~/store/channel'

const channelStore = useChannelStore()
const isOpen = ref(false)
const name = ref('')

watch(isOpen, (val) => {
  if (!val) {
    name.value = ''
  }
})

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const createChannel = () => {
  channelStore.createChannel(name.value)
    .then(() => {
      close()
    })
    .catch((err) => {
      console.error(err)
    })
}

defineExpose({
  open,
  close
})
</script>
