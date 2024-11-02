<template>
  <NuxtLayout name="app">
    <project-header />
    <view-wrapper>
      <div class="space-y-3">
        <div class="flex items-center gap-3 h-10">
          <p class="text-lg">Variables</p>
          <div class="grow" />
          <UButton
            icon="i-heroicons-plus"
            size="sm"
            color="primary"
            variant="outline"
            label="Add Variable"
            :trailing="false"
            @click="onClickAddVariable"
          />
        </div>
        <UTable :rows="variables" :columns="columns">
          <template #value-data="{ row }">
            <UButton variant="ghost" color="gray" @click="() => onClickCopySource(row.value)">
              <span class="w-full max-w-xl truncate">{{ row.value }}</span>
              <template #trailing>
                <UIcon name="i-heroicons-clipboard" class="w-5 h-5" />
              </template>
            </UButton>
          </template>

          <template #actions-data="{ row }">
            <UButton variant="ghost" color="gray" @click="() => onClickDelete(row.id)">
              <template #trailing>
                <UIcon name="i-heroicons-trash" class="w-5 h-5" />
              </template>
            </UButton>
          </template>
        </UTable>
      </div>
    </view-wrapper>
  </NuxtLayout>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import AddVariable from '@/components/dialogs/AddVariable.vue'
import { useVariableStore } from '@/store/variable'
import { useProjectStore } from '@/store/project'

useHead({
  title: 'Variables: BugMuggle'
})

const clipSource = ref('')
const { text, copy, copied, isSupported } = useClipboard({ source: clipSource })

const modal = useModal()
const toast = useToast()

definePageMeta({
  middleware: 'auth'
})

const { projectId } = useRoute().params

const variableStore = useVariableStore()
const projectStore = useProjectStore()

const columns = [
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Value', key: 'value', sortable: false },
  { label: 'Actions', key: 'actions', sortable: false }
]

const variables = computed(() => variableStore.getVariables(+projectId))
const project = computed(() => projectStore.getProjects.find(project => project.id === +projectId) || {})

const onClickCopySource = (value) => {
  clipSource.value = value
  copy()
  toast.add({
    title: 'Copied',
    description: 'Variable value copied to clipboard'
  })
}

const onClickDelete = (id) => {
  variableStore.deleteVariable(projectId, id)
}

const onClickAddVariable = () => {
  modal.open(
    AddVariable,
    {
      projectId,
      onSuccess: () => {
        toast.add({
          title: 'Variable added',
          description: 'Variable added successfully'
        })
      }
    }
  )
}

onMounted(() => {
  if (!variableStore.isProjectVariablesReady(projectId)) {
    variableStore.fetchVariables(projectId)
  }
})
</script>
