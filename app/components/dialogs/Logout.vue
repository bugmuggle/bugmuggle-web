<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        Confirm Logout
      </template>
      <p>Are you sure you want to log out?</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" size="xs" label="Cancel" variant="ghost" @click="close" />
          <UButton color="red" size="xs" label="Logout" variant="solid" @click="logout" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
const router = useRouter()
const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}
const close = () => {
  isOpen.value = false
}

const logout = () => {
  router.push({ path: '/logout' })
}

defineExpose({
  open,
  close,
})
</script>
