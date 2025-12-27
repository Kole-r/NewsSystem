<template>
    <div>
        <el-page-header content="个人中心" icon="" title="企业门户网站后台管理系统" />
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="6" style="margin-top: 20px;">
                <el-card class="box-card">
                    <div class="card-body">
                        <el-avatar :size="100" :src="avatarUrl" />
                        <p>用户名: {{ username }}</p>
                        <h5>{{ role === 1 ? "管理员" : "编辑" }}</h5>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16" style="margin-top: 20px;">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span style="margin-left: 1px;">个人信息</span>
                        </div>
                    </template>
                    <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="auto">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="userForm.username" />
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="userForm.gender" class="m-2" placeholder="Select" style="width: 100%">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="个人简介" prop="introduction">
                            <el-input v-model="userForm.introduction" type="textarea" />
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <el-upload class="avatar-uploader"
                                action=""
                                :show-file-list="false" :auto-upload="false" :on-change="handChange">
                                <img v-if="userForm.avatar" :src="uploadAvatar" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                        </el-form-item>
                        <el-form-item style="margin-left: 80px;">
                            <el-button class="!ml-0" :plain="true" type="primary" @click="submitForm">保存</el-button>
                        </el-form-item>

                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue';
import useUserInfoStore from '../../store/userInfo.js';
import { computed, reactive, ref } from 'vue';
import axios from '../../util/axios.config.js';
import { ElMessage } from 'element-plus'
const userInfo = useUserInfoStore();
const { username, gender, introduction, role, avatar } = userInfo.$state;
const userFormRef = ref();
const userForm = reactive({
    username,
    gender,
    introduction,
    avatar,
    file: null
});
console.log('初始头像路径:', userForm.avatar);
// 推荐使用状态管理库（如 Pinia）的状态来判断响应式数据，确保全局共享和实时更新
// 计算属性动态生成头像 URL
const avatarUrl = computed(() => userInfo.$state.avatar ?  userInfo.$state.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
// 计算属性动态生成上传后的头像 URL
const uploadAvatar = computed(() => userForm.avatar.includes('blob:') ? userForm.avatar :  userForm.avatar);
// 表单数据规则
const userFormRules = reactive({
    username: [{ required: true, message: "请输入名字", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
    introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
    avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
});

//性别选择
const options = [
    {
        label: "未知",
        value: 0,
    },
    {
        label: "男",
        value: 1,
    },
    {
        label: "女",
        value: 2,
    },
];

const handChange = (file) => {
    console.log('上传的文件:', file.raw);
    userForm.avatar = URL.createObjectURL(file.raw);
    userForm.file = file.raw;
};
const submitForm = () => {
    userFormRef.value.validate((valid) => {
        if (valid) {
            const formData = new FormData();//因为涉及文件上传，所以用formdata
            for (let i in userForm) {
                formData.append(i, userForm[i]);
            }
            axios.post("/adminApi/user/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }// 告知服务器这是一个文件上传请求
            }).then(res => {
                console.log('后端返回的 data 数据:', res.data.data);
                if (res.data.code === 200) {
                    // ✅ 使用后端返回的服务器路径
                    //为什么要有后备？因为有可能用户没有更换头像，后端就不会返回新的头像路径
                    const serverAvatar = res.data.data.avatar || userForm.avatar;
                    
                    // 更新用户信息到 Pinia Store
                    userInfo.setUserInfo({
                        ...userInfo.$state,
                        username: userForm.username,
                        introduction: userForm.introduction,
                        gender: Number(userForm.gender),
                        avatar: serverAvatar  // 使用服务器返回的路径
                    });
                    
                    // 同步更新表单中的头像路径
                    userForm.avatar = serverAvatar;
                    
                    console.log('保存后的头像路径:', userInfo.$state.avatar);
                }
            });
        }
    });
    ElMessage({
        message: '更新成功！！！',
        type: 'success',
    })
};
</script>


<style scoped lang="scss">
:deep(.avatar-uploader .el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
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