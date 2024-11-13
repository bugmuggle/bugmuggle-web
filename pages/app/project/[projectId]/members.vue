<template>
  <NuxtLayout name="app">
    <resolve-wrapper>
      <project-header />
      <view-wrapper>
        <div class="w-full max-w-screen-md mx-auto block px-3 py-6 space-y-3">
          <h1 class="text-2xl font-bold">
            Members
          </h1>

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
useHead({
  title: 'Files: BugMuggle'
})

definePageMeta({
  middleware: 'auth'
})

const columns = ref([
  {
    key: 'id',
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
])

const members = ref([])

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
</script>
