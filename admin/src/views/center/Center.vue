<template>
    <div>
        <el-page-header content="个人中心" icon="" title="企业门户网站后台管理系统" class="page-header" />
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="6" style="margin-top: 20px;">
                <el-card class="box-card">
                    <div class="card-body">
                        <el-avatar :size="100" :src="avatarUrl" />
                        <p>用户名: {{ username }}</p>
                        <h5>{{ role === 1 ? "管理员" : "编辑者" }}</h5>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="18" style="margin-top: 20px;">
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
                            <Upload :avatar="userForm.avatar" @koleChange="handChange" />
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
import useUserInfoStore from '../../store/userInfo.js';
import { computed, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'
import upload from '@/util/upload.js';
import Upload from '@/components/upload/Upload.vue';
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
const avatarUrl = computed(() => userInfo.$state.avatar ? userInfo.$state.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');

// 表单数据规则
const userFormRules = reactive({
    username: [{ required: true, message: "请输入名字", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
    introduction: [{ required: false, message: "请输入介绍", trigger: "blur" }],
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
    console.log('上传的文件:', file);
    userForm.avatar = URL.createObjectURL(file);
    userForm.file = file;
};
const submitForm = () => {
    userFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await upload("/adminApi/user/upload", userForm)
            console.log('后端返回的 data 数据:', res.data);
            if (res.code === 200) {
                // ✅ 使用后端返回的服务器路径
                //为什么要有后备？因为有可能用户没有更换头像，后端就不会返回新的头像路径
                const serverAvatar = res.data.avatar || userForm.avatar;

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

        }
    });
    ElMessage({
        message: '更新成功！！！',
        type: 'success',
    })
};
</script>

<style lang="scss" scoped>
// 基础容器
.page-header {
    background-color: #ffffff;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

// 左侧头像卡片
.box-card {
    text-align: center;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
    }

    .card-body {
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .el-avatar {
            border: 4px solid #f0f2f5;
            margin-bottom: 15px;
        }

        p {
            font-size: 16px;
            color: #303133;
            margin: 10px 0 5px;
            font-weight: bold;
        }

        h5 {
            font-size: 13px;
            color: #909399;
            font-weight: normal;
            background: #f4f4f5;
            padding: 4px 12px;
            border-radius: 12px;
            margin-top: 5px;
        }
    }
}

// 右侧信息卡片
:deep(.el-card) {
    border-radius: 8px;

    .card-header {
        display: flex;
        align-items: center;
        justify-content: center; // 标题居中，与你原图一致
        font-size: 18px;
        font-weight: 600;
        color: #333;
        padding: 10px 0;
    }
}

// 表单美化
.el-form {
    padding: 10px 20px;

    :deep(.el-form-item__label) {
        font-weight: 600;
        color: #606266;
    }

    // 调整保存按钮区域
    .el-form-item:last-child {
        margin-top: 30px;

        .el-button {
            width: 120px;
            padding: 12px 20px;
            font-size: 14px;
        }
    }
}

// 输入框聚焦时的平滑过渡
:deep(.el-input__inner),
:deep(.el-textarea__inner) {
    transition: all 0.2s;

    &:focus {
        background-color: #fcfcfc;
    }
}
</style>
