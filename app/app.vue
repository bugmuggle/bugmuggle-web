<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtPage />
  <UNotifications :ui="{ 
    container: 'z-[9999]'
  }" />
</template>
