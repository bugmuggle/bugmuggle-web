<template>
  <div class="border border-zinc-800 hover:border-zinc-500 rounded-md h-auto p-2">
    <div id="editorjs" class="min-h-[200px]"></div>
  </div>
</template>

<script setup>
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import Quote from '@editorjs/quote'
import Paragraph from '@editorjs/paragraph'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
})

const inputContent = defineModel()
let editor = null

const initEditor = () => {
  editor = new EditorJS({
    holder: 'editorjs',
    readOnly: props.readonly,
    tools: {
      header: {
        class: Header,
        config: {
          levels: [1, 2, 3, 4, 5, 6],
          defaultLevel: 3,
        },
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      code: Code,
      quote: {
        class: Quote,
        inlineToolbar: true,
      },
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
    },
    onChange: async () => {
      if (!props.readonly) {
        const outputData = await editor.save()
        inputContent.value = outputData
      }
    },
  })
}

const setContent = async (content) => {
  if (editor) {
    await editor.render(content)
  }
}

onMounted(() => {
  initEditor()
  if (inputContent.value) {
    setContent(inputContent.value)
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
  }
})

defineExpose({
  setContent,
})
</script>

<style>
.ce-block__content {
  max-width: 100%;
}

.ce-toolbar__content {
  max-width: 100%;
}

.codex-editor {
  color: #e4e4e4;
}

.ce-block--selected .ce-block__content {
  background: #2d2d2d;
}

.ce-toolbar__plus {
  color: #e4e4e4;
}

.ce-toolbar__settings-btn {
  color: #e4e4e4;
}

.ce-inline-toolbar {
  background: #2d2d2d;
  border: 1px solid #4a5568;
}

.ce-inline-toolbar__buttons {
  color: #e4e4e4;
}

.ce-conversion-toolbar {
  background: #2d2d2d;
  border: 1px solid #4a5568;
}

.ce-conversion-toolbar__label {
  color: #e4e4e4;
}

.ce-conversion-toolbar__icon {
  background-color: #e4e4e4;
}

.cdx-block {
  padding: 0.5rem 0;
}

.cdx-input {
  color: #e4e4e4;
  background: #2d2d2d;
  border: 1px solid #4a5568;
}

.cdx-settings-button {
  color: #e4e4e4;
}

.cdx-settings-button:hover {
  background: #4a5568;
}
</style> 
