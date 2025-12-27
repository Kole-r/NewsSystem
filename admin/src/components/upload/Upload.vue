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
const uploadAvatar = computed(() => props.avatar.includes('blob:') ? props.avatar :"http://localhost:3000"+ props.avatar);
const handChange = (file) => {
    emit("koleChange",file.raw)
};
</script>