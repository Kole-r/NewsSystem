<template>
    <el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" :on-change="handChange">
        <img v-if="props.avatar" :src="uploadAvatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>
</template>
<script setup>
import { defineEmits,defineProps ,computed} from 'vue';
import { Plus } from '@element-plus/icons-vue';

const props = defineProps({
    avatar:String
})
const emit = defineEmits(["koleChange"])
// 计算属性动态生成上传后的头像 URL
const uploadAvatar = computed(() => props.avatar);
const handChange = (file) => {
    emit("koleChange",file.raw)
};
</script>
<style scoped lang="scss">
:deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

:deep(.avatar) {
    width: 178px;
    height: 178px;
    display: block;
}
</style>