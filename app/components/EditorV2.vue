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
import ImageTool from '@editorjs/image'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
})

const inputContent = defineModel()
let editor = null
let isEditorReady = false

const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch('/api/channel/attachments/upload', {
      method: 'POST',
      body: formData,
    })

    return response
  } catch (error) {
    console.error('Error uploading image:', error)
    return {
      success: 0,
      error: {
        message: 'Failed to upload image',
      },
    }
  }
}

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
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile(file) {
              return uploadImage(file)
            },
            uploadByUrl(url) {
              return uploadImage(url)
            },
          },
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
  color: white;
}
.ce-toolbar__settings-btn {
  color: white;
}

.ce-toolbar__plus:hover {
  color: gray;
}
.ce-toolbar__settings-btn:hover {
  color: gray;
}

.cdx-search-field__input {
  color: gray;
}

/* Quote styles */
.cdx-quote {
  margin: 1rem;
}

.cdx-quote__text {
  color: white;
  font-style: italic;
}

.cdx-quote__caption {
  display: none !important;
}
</style>
