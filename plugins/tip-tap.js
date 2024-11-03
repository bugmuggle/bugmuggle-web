import { Editor, EditorContent } from '@tiptap/vue-3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('TipTapEditorContent', EditorContent)

  return {
    provide: {
      TipTapEditor: Editor
    }
  }
})
