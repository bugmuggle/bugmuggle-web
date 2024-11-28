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

      <UForm v-else ref="form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Role" name="role">
          <USelect v-model="state.role" :options="roles" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div v-if="showNewUserPassword" class="flex items-center justify-end gap-2">
          <UButton @click="() => refModal.close()" color="gray">
            Close
          </UButton>
        </div>
        <div v-else class="flex items-center gap-2">
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
  projectStore.addMember(props.projectId, event.data)
    .then((response) => {
      if (response.password) {
        showNewUserPassword.value = true
        newUserPassword.value = response.password
      } else {
        refModal.value.close()
      }
    })
}

const emit = defineEmits(['success'])
</script>
