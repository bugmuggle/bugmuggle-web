<template>
  <div class="border border-zinc-800 hover:border-zinc-500 rounded-md h-auto p-2">
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<script setup>
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Placeholder as TiptapPlaceholder } from '@tiptap/extension-placeholder'
import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

const lowlight = createLowlight(all);

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
lowlight.register('javascript', js)
lowlight.register('typescript', ts)

const inputContent = defineModel()

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'focus:outline-none min-h-[200px]'
    },
  },
  extensions: [
    TiptapStarterKit.configure({
      codeBlock: false,
    }),
    Highlight,
    Typography,
    /* TiptapPlaceholder.configure({
      emptyEditorClass: 'is-data-empty',
      placeholder: 'Describe the task...',
    }), */
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'javascript',
    }),
  ],
  onUpdate: ({ editor }) => {
    inputContent.value = editor.getHTML()
  }
});

const setContent = (content) => {
  if (!!unref(editor)) {
    unref(editor).commands.setContent(content);
  }
}

onMounted(() => {
  setContent(inputContent.value)
});

onBeforeUnmount(() => {
  unref(editor).destroy();
});


defineExpose({
  setContent
})
</script>

<style>
.is-data-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #7e7e7e;
  pointer-events: none;
  height: 0;
}

.ProseMirror {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: #2d2d2d;
    border-radius: 0.25rem;
    color: #e4e4e4;
    font-size: 0.85rem;
    padding: 0.2rem 0.4rem;
  }

  pre {
    background: #292929;
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }

    /* Code highlighting styles */
    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }

  blockquote {
    border-left: 3px solid #4a5568;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #e6e6e6;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
}
</style>
