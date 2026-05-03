<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted ,defineEmits, watch} from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const emit = defineEmits(['event'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = '<p>模拟 Ajax 异步设置内容aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>'
        console.log('Emitting event with content:', valueHtml.value) // 添加日志
        emit('event', valueHtml.value) // 通过 emit 将内容传递给父组件
    }, 1500)
})

// 监听 valueHtml 的变化，并实时触发 emit
watch(valueHtml, (newValue) => {
    emit('event', newValue); // 实时将最新内容传递给父组件
});

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const mode = ref('default') // 定义 mode 的默认值
</script>