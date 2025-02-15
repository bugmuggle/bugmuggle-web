<template>
  <div class="relative w-full max-w-screen-xl block mx-auto">
    <div class="flex items-center gap-3 h-14 px-3">
      <nuxt-link to="/" class="inline-flex items-center gap-2">
        <img src="/logo.svg" width="24" height="24">
        <span class="font-medium text-lg">Bugmuggle</span>
      </nuxt-link>
    </div>

    <slot />
  </div>
</template>
