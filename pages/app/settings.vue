<template>
  <NuxtLayout name="app">
    <div class="realtive absolute top-0 right-0 bottom-0 left-0 overflow-y-auto">
      <div class="w-full max-w-screen-md mx-auto block px-3 py-6 space-y-3">
        <h1 class="text-2xl font-bold">
          Settings
        </h1>

        <UCard>
          <template #header>
            Your Profile
          </template>

          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-8">
              <UForm class="space-y-3">
                <UFormGroup label="Full Name">
                  <UInput size="xl" />
                </UFormGroup>

                <UFormGroup label="What are you doing these days?">
                  <UInput size="xl" />
                </UFormGroup>

                <UFormGroup label="Display Name">
                  <UInput size="xl" />
                </UFormGroup>

                <UFormGroup label="Position/Title">
                  <UInput size="xl" />
                </UFormGroup>

                <UFormGroup label="Phone Number">
                  <UInput size="xl" />
                </UFormGroup>
              </UForm>
            </div>

            <div class="col-span-4 space-y-3">
              <div class="h-56 aspect-square bg-gray-800 rounded-lg" />
              <UButton block label="Upload Photo" variant="outline" size="xl" />
              <UButton block label="Clear Photo" variant="ghost" color="gray" size="xl" />
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            Security
          </template>

          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">
                  Email
                </p>
                <p class="text-sm">
                  test@gmail.com
                </p>
              </div>

              <UButton size="sm" label="Change Email Address" variant="link" />
            </div>

            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="text-sm text-gray-500">
                  Password
                </p>
                <p class="text-sm">
                  Manage your account password
                </p>
              </div>

              <UButton size="sm" label="Change Password" variant="link" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </NuxtLayout>
</template>