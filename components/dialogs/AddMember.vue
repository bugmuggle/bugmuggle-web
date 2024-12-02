<template>
  <UModal ref="refModal">
    <UCard>
      <template #header>
        <div v-if="showNewUserPassword">
          Copy new member's account password
        </div>
        <div v-else>
          Add Member into "{{ project.name }}"
        </div>
      </template>

      <div v-if="showNewUserPassword" class="space-y-3">
        <p>
          A new user account has been created and added to the firm. Below is the password. Click the button to copy it:
        </p>
        <UButton :color="copied ? 'green' : 'gray'" size="xl" variant="solid" block>
          <div class="flex items-center w-full justify-between" @click="() => copy(newUserPassword)">
            {{ newUserPassword }}
            <Icon :name="copied ? 'i-heroicons:check-circle' : 'i-heroicons:clipboard-document'" size="24" />
          </div>
        </UButton>
      </div>

      <div v-else class="space-y-4">
        <UAlert v-if="error" color="red" variant="outline" :description="error"/>

        <UForm ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
          </UFormGroup>

          <UFormGroup label="Role" name="role">
            <USelect v-model="state.role" :options="roles" />
          </UFormGroup>
        </UForm>
      </div>

      <template #footer>
        <div v-if="showNewUserPassword" class="flex items-center justify-end gap-2">
          <UButton @click="closeModal()" color="gray">
            Close
          </UButton>
        </div>
        <div v-else class="flex items-center gap-2">
          <div class="grow" />
          <UButton @click="closeModal()" color="gray">
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
import { useClipboard } from '@vueuse/core'
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

const error = ref(null)
const showNewUserPassword = ref(false)
const newUserPassword = ref('test')
const { text, copy, copied, isSupported } = useClipboard({ newUserPassword })

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
  error.value = null
  projectStore.addMember(props.projectId, event.data)
    .then((response) => {
      if (response.password) {
        showNewUserPassword.value = true
        newUserPassword.value = response.password
      } else {
        refModal.value.close()
      }
    })
    .catch((err) => {
      error.value = err.statusMessage || 'Failed to add member'
    })
}

const emit = defineEmits(['success'])

const closeModal = () => {
  cleanup()
  refModal.value.close()
}

const cleanup = () => {
  error.value = null
  state.email = ''
  state.role = 'member'
  showNewUserPassword.value = false
}

</script>
