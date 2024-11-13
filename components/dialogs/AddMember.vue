<template>
  <UModal ref="refModal">
    <UCard>
      <template #header>
        Add Member into "{{ project.name }}"
      </template>

      <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Role" name="role">
          <USelect v-model="state.role" :options="roles" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex items-center gap-2">
          <div class="grow" />
          <UButton @click="emit('close')" color="gray">
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
import { useProjectStore } from '@/store/project'
import { z } from 'zod'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const roles = ['admin', 'member']

const refModal = ref(null)
const form = ref(null)
const store = useVariableStore()
const projectStore = useProjectStore()

const schema = z.object({
  email: z.string().email('Email is required'),
  role: z.string().min(1, 'Role is required')
})

const state = reactive({
  email: '',
  role: 'member'
})

const project = computed(() => {
  return projectStore.getProjectById(props.projectId)
})

const onSubmit = (event) => {
  projectStore.addMember(props.projectId, event.data)
}

const emit = defineEmits(['success'])
</script>
