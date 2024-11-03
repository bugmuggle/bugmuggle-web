<template>
  <div class="space-y-0 flex flex-col px-3 h-full pb-4">
    <div class="flex items-center gap-3 h-12 py-3">
      <UButton
        icon="i-heroicons-bold"
        variant="ghost"
        color="gray"
        @click="editor.commands.toggleBold()"
      />
      <UButton
        icon="i-heroicons-italic"
        variant="ghost"
        color="gray"
        @click="editor.commands.toggleItalic()"
      />
      <UButton
        icon="i-heroicons-strikethrough"
        variant="ghost"
        color="gray"
        @click="editor.commands.toggleStrike()"
      />

      <div class="w-1 h-full border-r border-gray-700" />

      <UButton
        icon="i-heroicons-list-bullet"
        variant="ghost"
        color="gray"
        @click="editor.commands.toggleBulletList()"
      />

      <UButton
        icon="i-heroicons-numbered-list"
        variant="ghost"
        color="gray"
        @click="editor.commands.toggleOrderedList()"
      />

      <div class="w-1 h-full border-r border-gray-700" />

      <UButton
        icon="i-heroicons-link"
        variant="ghost"
        color="gray"
        @click="editor.commands.toggleLink()"
      />


    </div>
    <div class="px-3 cursor-text" @click="editor.commands.focus()">
      <TipTapEditorContent :editor="editor" />
    </div>
    <div class="flex items-center gap-3">
      <div class="grow" />
      <UButton
        icon="i-heroicons-paper-airplane"
        variant="ghost"
        color="gray"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '@/store/chat'
import StarterKit from '@tiptap/starter-kit'
const { $TipTapEditor } = useNuxtApp()

const projectId = useRoute().params.projectId
const editor = ref(null)
const chatStore = useChatStore()

const sendMessage = () => {
  const message = editor.value.getHTML()
  chatStore.sendMessage(message, projectId)
    .finally(() => {
      editor.value.commands.clearContent()
    })
}

onMounted(() => {
  editor.value = new $TipTapEditor({
    content: '',
    extensions: [StarterKit]
  })
})

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<style>
.ProseMirror {
  outline: none !important;
}
</style>
