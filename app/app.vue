<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <UApp>
    <NuxtPage />
  </UApp>
  <UNotifications :ui="{ 
    container: 'z-[9999]'
  }" />
</template>
