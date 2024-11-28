<template>
  <NuxtLayout name="app">
    <resolve-wrapper>
      <project-header />
      <view-wrapper>
        <div class="w-full max-w-screen-md mx-auto block px-3 py-6 space-y-3">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold">
              Members
            </h1>

            <div class="grow" />

            <UButton icon="i-heroicons-plus" color="gray" label="Add Member" @click="onClickAddMember" />
          </div>

          <UTable :rows="members" :columns="columns">
            <template #actions-header>
              <p class="text-right">Actions</p>
            </template>
            <template #actions-data="{ row }">
              <div class="flex items-center justify-end">
                <UDropdown
                  :items="actionMenuMember"
                  :popper="{ placement: 'bottom' }"
                >
                  <UButton
                    icon="i-heroicons-ellipsis-vertical"
                    size="sm"
                    square
                    color="gray"
                  />

                  <template #item="{ item }">
                    <div class="flex items-center justify-between w-full" @click="() => onClickDeleteMember(row.userId)">
                      <span class="truncate">{{ item.label }}</span>
                      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                    </div>
                  </template>
                </UDropdown>
              </div>
            </template>
          </UTable>
        </div>
      </view-wrapper>
    </resolve-wrapper>
  </NuxtLayout>
</template>

<script setup>
import AddMember from '@/components/dialogs/AddMember'
import { useProjectStore } from '@/store/project'
import { useUserStore } from '@/store/user'

useHead({
  title: 'Members: BugMuggle'
})

definePageMeta({
  middleware: 'auth'
})

const modal = useModal()

const userStore = useUserStore()
const projectStore = useProjectStore()
const projectId = useRoute().params.projectId

const columnsDefault = [
  {
    key: 'userId',
    label: 'ID'
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'role',
    label: 'Role'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]

const areYouAdminOrOwner = computed(() => {
  const profileId = userStore.getProfile.id
  return projectStore.isMemberAdmin(profileId, projectId) || projectStore.isMemberOwner(profileId, projectId)
})

const columns = computed(() => {
  return areYouAdminOrOwner.value ? columnsDefault : columnsDefault.filter(x => x.key !== 'actions')
})

const members = computed(() => {
  return (projectStore.getMembersByProjectId(projectId) || [])
    .map(x => ({ ...x, name: `${x.firstName || ''} ${x.lastName || ''}`}))
})

const onClickAddMember = function () {
  modal.open(AddMember, {
    projectId
  })
}

const onClickDeleteMember = function (userId) {
  projectStore.deleteMember(userId, projectId)
}

const actionMenuMember = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square'
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      color: 'red'
    }
  ]
]

onMounted(() => {
  if (!projectStore.isInit['members-' + projectId]) {
    projectStore.fetchMembers(projectId)
  }
})
</script>
