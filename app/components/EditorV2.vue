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
import Paragraph from '@editorjs/paragraph'
import Hyperlink from 'editorjs-hyperlink'
import DragDrop from 'editorjs-drag-drop'
import Quote from '@editorjs/quote'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
})

const inputContent = defineModel()
let editor = null
let isEditorReady = false

const initEditor = async () => {
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
      hyperlink: Hyperlink,
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: '',
        },
      },
    },
    onChange: async () => {
      if (!props.readonly) {
        const outputData = await editor.save()
        inputContent.value = outputData
      }
    },
    onReady: () => {
      isEditorReady = true
      if (inputContent.value) {
        setContent(inputContent.value)
      }
      new DragDrop(editor, '2px dashed #fff')
    },
  })
}

const isHtmlOrPlainText = (str) => {
  if (!str) return false

  // If it looks like HTML, accept it
  if (/<[a-z][\s\S]*>/i.test(str)) return true

  // Try to parse JSON — if it's a structured object/array, reject
  try {
    const parsed = JSON.parse(str)
    if (typeof parsed === 'object' && parsed !== null) return false
  } catch (e) {
    // Not JSON — treat as plain text
    return true
  }

  // If it's a primitive (number, boolean), also not valid
  return false
}

const setContent = async (content) => {
  if (editor && isEditorReady) {
    try {
      if (isHtmlOrPlainText(content)) {
        await editor.render({
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: content.toString(),
              },
            },
          ],
        })
        return
      } else {
        await editor.render({
          blocks: JSON.parse(content),
        })
      }
    } catch (error) {
      console.error('Error rendering content:', error)
    }
  }
}

onMounted(async () => {
  await initEditor()
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
.ce-toolbar__plus {
  color: #e4e4e4;
}

.ce-toolbar__settings-btn {
  color: #e4e4e4;
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

/* Checklist styles */
.cdx-checklist__item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

.cdx-checklist__item-checkbox {
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
  border: 1px solid #4a5568;
  border-radius: 3px;
  background: #2d2d2d;
}

.cdx-checklist__item--checked .cdx-checklist__item-checkbox {
  background: #4a5568;
}

.cdx-checklist__item-text {
  color: #e4e4e4;
  flex-grow: 1;
}

/* Quote styles */
.cdx-quote {
  /* border-left: 3px solid #4a5568; */
  /* padding-left: 1rem; */
  margin: 1rem;
}

.cdx-quote__text {
  color: #e4e4e4;
  font-style: italic;
}

.cdx-quote__caption {
  display: none !important;
}
</style>
