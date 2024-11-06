<template>
  <USlideover ref="refSlideover">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <p class="font-bold first-letter:uppercase">{{ fullName }}</p>
          <div class="grow" />
          <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="sm" @click="onClose" />
        </div>
      </template>

      <div class="relative w-full bg-gray-600 rounded-md before:pb-[100%] before:block">
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon name="i-heroicons-user" size="128" />
        </div>
      </div>
    </UCard>
  </USlideover>
</template>

<script setup>
import { useUserStore } from '@/store/user'

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

const { fullName } = useUserStore()
const refSlideover = ref(null)

const onClose = () => {
  refSlideover.value.close()
}
</script>
