<template>
    <div class="nd-editor">
        <Toolbar
            class="nd-editor-toolbar"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
        />
        <Editor
            class="nd-editor-body"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'

import { onBeforeUnmount, ref, shallowRef, onMounted, defineEmits, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const emit = defineEmits(['event'])

const editorRef = shallowRef()
const valueHtml = ref('<p></p>')

onMounted(() => {
    setTimeout(() => {
        valueHtml.value = '<p></p>'
        emit('event', valueHtml.value)
    }, 500)
})

watch(valueHtml, (newValue) => {
    emit('event', newValue)
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor
}
const mode = ref('default')
</script>

<style lang="scss">
/* ── WangEditor Dark Override ── */

.nd-editor {
    border: 1px solid #333333;
    border-radius: 8px;
    overflow: hidden;
}

/* ── Toolbar ── */
.nd-editor-toolbar {
    border-bottom: 1px solid #222222 !important;
    background: #111111 !important;

    .w-e-bar {
        background: #111111 !important;
        border: none !important;
        color: #999999 !important;
        padding: 4px 8px !important;
    }

    .w-e-bar-divider {
        background: #222222 !important;
    }

    .w-e-bar-item {
        .btn-text {
            color: #999999 !important;
            fill: #999999 !important;
        }

        &:hover {
            .btn-text {
                color: #E8E8E8 !important;
                fill: #E8E8E8 !important;
            }
        }

        button {
            background: transparent !important;
            color: #999999 !important;

            &:hover {
                background: #1A1A1A !important;
                color: #E8E8E8 !important;
            }
        }

        svg {
            fill: #999999 !important;
            color: #999999 !important;
        }

        &:hover svg {
            fill: #E8E8E8 !important;
            color: #E8E8E8 !important;
        }
    }

    .w-e-bar-item-active {
        background: #1A1A1A !important;

        .btn-text,
        svg {
            color: #FFFFFF !important;
            fill: #FFFFFF !important;
        }
    }

    /* Dropdown menus in toolbar */
    .w-e-drop-panel {
        background: #1A1A1A !important;
        border: 1px solid #333333 !important;
        border-radius: 8px !important;
        box-shadow: none !important;

        .w-e-drop-panel-item {
            color: #999999 !important;

            &:hover {
                background: #222222 !important;
                color: #E8E8E8 !important;
            }
        }
    }

    /* Select / combobox */
    .w-e-select-list {
        background: #1A1A1A !important;
        border: 1px solid #333333 !important;
        border-radius: 8px !important;

        .w-e-select-item {
            color: #999999 !important;

            &:hover {
                background: #222222 !important;
                color: #E8E8E8 !important;
            }
        }
    }
}

/* ── Editor Body ── */
.nd-editor-body {
    background: #0A0A0A !important;
    min-height: 400px;

    .w-e-text-container {
        background: #0A0A0A !important;
        color: #E8E8E8 !important;

        * {
            color: #E8E8E8 !important;
        }

        [data-slate-editor] {
            padding: 20px 24px !important;
            min-height: 400px !important;
        }

        /* Placeholder */
        .w-e-placeholder {
            color: #555555 !important;
            font-style: normal !important;
            padding-left: 24px !important;
        }

        /* Selection */
        ::selection {
            background: rgba(215, 25, 33, 0.3) !important;
        }

        /* Links */
        a {
            color: #5B9BF6 !important;
        }

        /* Code blocks */
        pre {
            background: #111111 !important;
            border: 1px solid #222222 !important;
            border-radius: 4px !important;
            padding: 12px 16px !important;

            code {
                color: #E8E8E8 !important;
                background: transparent !important;
            }
        }

        code {
            background: #1A1A1A !important;
            color: #E8E8E8 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
        }

        /* Blockquote */
        blockquote {
            border-left: 3px solid #333333 !important;
            color: #999999 !important;
            padding-left: 16px !important;
        }

        /* Table */
        table {
            border: 1px solid #333333 !important;

            th {
                background: #111111 !important;
                border: 1px solid #333333 !important;
                color: #E8E8E8 !important;
            }

            td {
                border: 1px solid #222222 !important;
                color: #E8E8E8 !important;
            }
        }

        /* Images */
        img {
            border: 1px solid #333333 !important;
            border-radius: 4px !important;
        }

        /* HR */
        hr {
            border: none !important;
            border-top: 1px solid #222222 !important;
        }

        /* Lists */
        ul, ol {
            padding-left: 24px !important;
        }
    }

    /* Scrollbar */
    .w-e-scroll {
        scrollbar-width: thin;
        scrollbar-color: #333333 transparent;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: #333333;
            border-radius: 2px;
        }
    }
}

/* ── Modal / Dialog overrides (image, link, video) ── */
.w-e-modal {
    background: #111111 !important;
    border: 1px solid #333333 !important;
    border-radius: 12px !important;
    box-shadow: none !important;

    .w-e-modal-header {
        color: #E8E8E8 !important;
        border-bottom: 1px solid #222222 !important;
    }

    input, textarea {
        background: #0A0A0A !important;
        border: 1px solid #333333 !important;
        border-radius: 6px !important;
        color: #E8E8E8 !important;
        padding: 8px 12px !important;

        &:focus {
            border-color: #666666 !important;
            outline: none !important;
        }

        &::placeholder {
            color: #555555 !important;
        }
    }

    button {
        background: transparent !important;
        border: 1px solid #333333 !important;
        color: #E8E8E8 !important;
        border-radius: 999px !important;
        padding: 6px 16px !important;

        &:hover {
            border-color: #E8E8E8 !important;
        }
    }
}

/* ── Tooltip ── */
.w-e-tooltip {
    background: #1A1A1A !important;
    border: 1px solid #333333 !important;
    border-radius: 6px !important;
    box-shadow: none !important;

    .w-e-tooltip-item-wrapper {
        color: #E8E8E8 !important;
    }
}

/* ── Fullscreen ── */
.w-e-full-screen-container {
    background: #000000 !important;
    z-index: 9999 !important;
}
</style>
