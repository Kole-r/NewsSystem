<template>
    <div>
        <el-page-header content="添加用户" icon="" title="用户管理" class="page-header" />
        <el-row :gutter="20" style="margin-top: 20px;">

            <el-col style="margin-top: 20px;">
                <el-card class="add-user-card">
                    <el-form ref="userFormRef" :model="userForm" :rules="userFormRules" label-width="auto">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="userForm.username" placeholder="请输入用户名" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="userForm.password" placeholder="请输入密码" />
                        </el-form-item>
                        <el-form-item label="角色" prop="role">
                            <el-select v-model="userForm.role" placeholder="请选择角色">
                                <el-option label="管理员" value="1" />
                                <el-option label="编辑" value="2" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="userForm.gender" class="m-2" placeholder="请选择性别" style="width: 100%">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="个人简介" prop="introduction">
                            <el-input v-model="userForm.introduction" type="textarea" placeholder="请输入个人简介" />
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <Upload :avatar="userForm.avatar" @koleChange="handChange" />
                        </el-form-item>
                        <el-form-item style="margin-left: 80px;">
                            <el-button class="!ml-0" :plain="true" type="primary" @click="submitForm">添加用户</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Upload from '@/components/upload/Upload.vue';
import upload from '@/util/upload.js';
import { useRouter } from 'vue-router';
const router = useRouter();
const userFormRef = ref();
const userForm = reactive({
    username: '',
    password: '',
    role: '2',
    gender: 0,
    introduction: '',
    avatar: '',
    file: null
});
const handChange = (file) => {
    console.log('上传的文件:', file);
    userForm.avatar = URL.createObjectURL(file);
    userForm.file = file;
};
const submitForm = () => {
    userFormRef.value.validate(async (valid) => {
        if (valid) {
            console.log('表单验证通过:', userForm);
            // 在这里处理表单提交逻辑，例如发送请求到后端
            await upload('/adminApi/user/add', userForm);
            router.push(`/user-management/UserList`);
        } else {
            console.log('表单验证失败');
            return false;
        }
    });
};
//规则
const userFormRules = reactive({
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    role: [{ required: true, message: "请选择角色", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
    introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
    avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
});

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
</script>

<style lang="scss" scoped>
.page-header {
    background-color: #ffffff;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.add-user-card {
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    padding: 20px;
}

.user-form {
    max-width: 600px; // 限制表单最大宽度，防止在大屏上过度拉伸
    margin: 0 auto; // 居中显示
    padding-top: 20px;

    :deep(.el-form-item__label) {
        font-weight: 600;
        color: #606266;
    }

    // 美化输入框
    :deep(.el-input__wrapper),
    :deep(.el-textarea__inner) {
        box-shadow: 0 0 0 1px #dcdfe6 inset;

        &:hover {
            box-shadow: 0 0 0 1px #409eff inset;
        }
    }

    // 按钮样式
    .submit-btn {
        width: 100%; // 按钮撑满当前列宽度
        height: 40px;
        font-weight: bold;
        margin-top: 10px;
        letter-spacing: 1px;
    }
}

// 响应式调整：在小屏幕上表单宽度自动适配
@media (max-width: 768px) {
    .user-form {
        max-width: 100%;
    }
}
</style>