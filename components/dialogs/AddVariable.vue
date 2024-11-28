<template>
  <UModal ref="refModal">
    <UCard>
      <template #header>
        Add Variable
      </template>

      <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup label="Value" name="value">
          <UInput v-model="state.value" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex items-center gap-2">
          <div class="grow" />
          <UButton @click="() => refModal.close()" color="gray">
            Cancel
          </UButton>
          <UButton type="button" @click="() => form.submit()">
            Add
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { useVariableStore } from '@/store/variable'
import { z } from 'zod'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const refModal = ref(null)
const form = ref(null)
const store = useVariableStore()

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.string().min(1, 'Value is required'),
})

const state = reactive({
  name: '',
  value: '',
})


const onSubmit = (event) => {
  console.log(event.data)
  store.createVariable(props.projectId, event.data)
    .then(() => {
      emit('success')
      refModal.value.close()
    })
}

const emit = defineEmits(['success'])
</script>

