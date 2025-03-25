<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ title }}
      </template>
      <p>{{ message }}</p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" @click="isOpen = false">Cancel</UButton>
          <UButton color="red" @click="onClickConfirm">Confirm</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
const isOpen = ref(false)
const title = ref('')
const message = ref('')
const callback = ref(() => {})

watch (isOpen, (value) => {
  if (!value) {
    callback.value = () => {}
    title.value = ''
    message.value = ''
  }
})

const onClickConfirm = () => {
  callback.value(true)
  isOpen.value = false
}

defineExpose({
  open: (args) => {
    title.value = args.title
    message.value = args.message
    callback.value = args.callback
    isOpen.value = true
  }
})
</script>
