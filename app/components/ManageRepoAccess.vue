<template>
  <UPopover>
    <UChip text="3" size="lg" position="top-right">
      <UButton color="white" label="Connected Repos" size="xs" icon="i-mdi-github" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UChip>
    <template #panel>
      <UCard>
        <UButton to="https://github.com/apps/Ov23licoj6wnVKnDaEJs">
          Test
        </UButton>
      </UCard>
    </template>
  </UPopover>
</template>
