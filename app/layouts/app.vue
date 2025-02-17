<template>
  <div class="relative h-dvh w-full overflow-hidden">
    <div class="absolute top-0 bottom-0 -left-64 lg:left-0 w-64 bg-gray-100 dark:bg-zinc-900 overflow-y-auto">
      <app-sidebar />
    </div>
    <div class="absolute top-0 right-0 bottom-0 left-0 lg:left-64">
      <slot />
    </div>
  </div>
</template>