<template>
    <el-header>
        <div class="left">
            <el-icon @click="handleCollapsed">
                <MenuIcon />
            </el-icon>
            <span style="margin-left: 10px;">企业门户管理系统</span>
        </div>
        <div class="right">
            <span>欢迎 xxxx 回来！！！</span>
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-icon >
                        <UserFilled />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleCenter">个人中心</el-dropdown-item>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>
<script setup>
import { useCollapseStore } from '../../store/collapse.js';
import { useRouter } from 'vue-router';
import { Menu as MenuIcon } from '@element-plus/icons-vue';
import { UserFilled } from '@element-plus/icons-vue';

const collapseStore = useCollapseStore(); // 获取 Pinia Store
const router = useRouter();

// 切换侧边栏折叠状态
const handleCollapsed = () => {
    collapseStore.setCollapsed();
}
const handleCenter=() => {
    router.push({path:'/center'})
}
const handleLogout = () => { 
    localStorage.removeItem("token");
    router.push({ path: '/login' });
}
</script>
<style scoped lang="scss">
.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #2d3a4b;
    box-shadow: 0 2px 8px #f0f1f2;

    .left {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        color: #f2f4f5;
        cursor: pointer;
    }

    .right {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        color: #e3e5e8;

        .el-dropdown-link {
            cursor: pointer;
            margin-left: 15px;
            display: flex;
            align-items: center;
        }

        
    }
    .el-icon {
        font-size: 25px;
        color: #f2f4f5;
        cursor: pointer;
    }
}
::v-deep(.el-dropdown-link) {
    outline: none;
}
</style>
