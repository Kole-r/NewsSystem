<template>
    <div>
        <el-page-header content="用户列表" icon="" title="用户管理" class="page-header" />
        <el-card class="box-card" style="margin-top: 20px;">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="index" label="序号" width="180" :index="index => index + 1" />
                <el-table-column prop="username" label="Username" width="180" />
                <el-table-column label="Avatar" width="350">
                    <template #default="scope">
                        <el-avatar
                            :src="scope.row.avatar ? scope.row.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
                    </template>
                </el-table-column>
                <el-table-column prop="role" label="Role">
                    <template #default="scope">
                        <el-tag :type="scope.row.role === 1 ? 'danger' : 'success'">
                            {{ scope.row.role === 1 ? '管理员' : '编辑者' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Operations">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-popconfirm title="确定要删除吗？" @confirm="handleDelete(scope.row)">
                            <template #reference>
                                <el-button size="small" type="danger">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog v-model="centerDialogVisible" title="编辑用户" width="500" align-center>
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
                    <el-form-item label="个人简介" prop="introduction">
                        <el-input v-model="userForm.introduction" type="textarea" placeholder="请输入个人简介" />
                    </el-form-item>
                    <el-form-item label="头像" prop="avatar">
                        <Upload :avatar="userForm.avatar" @koleChange="handleChange" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleConfirm()">
                            确定
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from '../../util/axios.config.js';
import Upload from '@/components/upload/Upload.vue';

const centerDialogVisible = ref(false);// 编辑悬浮框显示与否
const currentUserId = ref(null); // 当前编辑的用户ID
//编辑悬浮框表单数据
const userFormRef = ref();
const userForm = reactive({
    username: '',
    password: '',
    role: '2',
    introduction: '',
    avatar: '',
});
// 表单验证规则
const userFormRules = reactive({
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    role: [{ required: true, message: "请选择角色", trigger: "blur" }],
    introduction: [{ required: true, message: "请输入介绍", trigger: "blur" }],
    avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
});
const handleChange = (file) => {
    console.log('上传的文件:', file);
    userForm.avatar = URL.createObjectURL(file);
    userForm.file = file;
};
//确认
const handleConfirm = async () => {
    userFormRef.value.validate(async (valid) => {
        if (valid) {
            console.log('表单验证通过:', userForm);
            try {
                await axios.put(`/adminApi/user/list/${currentUserId.value}`, userForm);
                fetchUserList();
                centerDialogVisible.value = false;
                console.log('用户数据更新成功');
            } catch (error) {
                console.error('提交用户数据失败:', error);
            }
        } else {
            console.log('表单验证失败');
            return false;
        }
    });
};

/* 上面是编辑悬浮框相关代码 */
// 表单数据
const tableData = ref([])
// 获取用户列表
const fetchUserList = async () => {
    try {
        const response = await axios.get('/adminApi/user/list');
        console.log('用户列表响应:', response.data);

        // 假设后端返回的数据结构为 { data: { users: [...] } }
        tableData.value = response.data.data;
    } catch (error) {
        console.error('获取用户列表失败:', error);

        // 使用 UI 提示用户
        ElMessage.error('获取用户列表失败，请稍后重试');
    }
};
onMounted(fetchUserList);
// 编辑
const handleEdit = async (data) => {
    const res = await axios.get(`/adminApi/user/list/${data.id}`);  
    // 后端返回的是数组，需要取第一个元素
    const userData = res.data.data[0];
    currentUserId.value = userData.id;// 设置当前编辑的用户ID
    populateUserForm(userData);
    centerDialogVisible.value = true;
};
const populateUserForm = (userData) => {
    userForm.username = userData.username;
    userForm.role = String(userData.role); // 转换为字符串以匹配 el-select
    userForm.introduction = userData.introduction || '';
    userForm.avatar = userData.avatar || '';
    userForm.password = ''; // 密码不返回，清空
};
// 删除
const handleDelete = async (data) => {
    console.log('删除用户:', data);
    try {
        await axios.delete(`/adminApi/user/delete/${data.id}`);
        // 删除成功后，从表格数据中移除该用户
        tableData.value = tableData.value.filter(user => user.id !== data.id);
        console.log('用户删除成功');
    } catch (error) {
        console.error('删除用户失败:', error);
    }

};
</script>
<style scoped lang="scss">
.page-header {
    background-color: #ffffff;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.box-card {
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    padding: 20px;
}

// 移除按钮点击后的蓝色边框
:deep(.el-button:focus) {
    outline: none;
}
</style>