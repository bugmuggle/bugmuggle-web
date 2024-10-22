<template>
  <div class="flex items-start md:items-center pt-12 md:pt-0 justify-center h-screen">
    <div class="relative">
      <UCard>
        <slot />

        <template #footer>
          <p class="text-sm text-center text-gray-500">
            &copy; {{ new Date().getFullYear() }} {{ info.appName }}. All rights reserved.
          </p>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { info } = useAppConfig()
</script>
