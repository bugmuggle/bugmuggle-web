<template>
  <div class="relative h-full w-full">
    <div class="absolute top-0 right-0 left-0 h-12 px-3">
      <slot name="header" />
    </div>
    <div class="absolute top-12 right-0 bottom-0 left-0 z-10 px-3">
      <slot name="content" />
    </div>
  </div>
</template>
