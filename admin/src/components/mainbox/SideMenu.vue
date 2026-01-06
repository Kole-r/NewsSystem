<template>
    <el-aside width=auto>
        <el-menu :collapse="collapseStore.isCollapsed"
        :collapse-transition="false"
        :router="true"
        :default-active="route.fullPath"> <!-- 绑定状态 -->
            <el-menu-item index="/home">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/center">
                <el-icon>
                    <UserFilled />
                </el-icon>
                <span>个人中心</span>
            </el-menu-item>

            <el-sub-menu index="/user-management" v-admin>
                <template #title>
                    <el-icon>
                        <Avatar />
                    </el-icon>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="/user-management/UserAdd">添加用户</el-menu-item>
                <el-menu-item index="/user-management/UserList">用户列表</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/news-management">
                <template #title>
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>新闻管理</span>
                </template>
                <el-menu-item index="/news-management/NewsAdd">添加新闻</el-menu-item>
                <el-menu-item index="/news-management/NewsList">新闻列表</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/product-management">
                <template #title>
                    <el-icon>
                        <Reading />
                    </el-icon>
                    <span>产品管理</span>
                </template>
                <el-menu-item index="/product-management/ProductAdd">添加产品</el-menu-item>
                <el-menu-item index="/product-management/ProductList">产品列表</el-menu-item>
            </el-sub-menu>


        </el-menu>
    </el-aside>
</template>
<script setup>
import { HomeFilled, UserFilled, Avatar, Promotion, Management, Reading } from '@element-plus/icons-vue'
import { useCollapseStore } from '../../store/collapse.js'// 导入 Pinia Store
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '../../store/userInfo.js';

            
const collapseStore = useCollapseStore(); // 获取 Pinia Store
const route = useRoute();
const userInfo = useUserInfoStore();
console.log('当前用户角色:', userInfo.$state.role);
const vAdmin={
    mounted(el) {
        if (userInfo.$state.role !== 1) {
            el.parentNode && el.parentNode.removeChild(el);
        }
    }
};

</script>

<style scoped lang="scss">
// 侧边栏容器
.el-aside {
    min-height: 100vh;
    height: auto;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);

    .el-menu {
        height: 100%;
        border-right: none;

        // --- 亮色主题 Element Plus 变量配置 ---
        --el-menu-text-color: #333;
        --el-menu-hover-text-color: #409eff;
        --el-menu-hover-bg-color: #f4f5f7;
        --el-menu-active-color: #409eff;
        --el-menu-bg-color: #ffffff;
        --el-menu-item-height: 48px; // 统一高度
        --el-menu-sub-item-height: 48px; // 统一子项高度

        // 确保所有一级菜单项和标题高度一致，并禁用文本选择
        :deep(.el-menu-item),
        :deep(.el-sub-menu__title) {
            height: var(--el-menu-item-height); // 强制使用统一高度
            line-height: var(--el-menu-item-height); // 保证文字垂直居中
            padding-left: 20px !important;

            // 禁用文本选中
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

            transition: all 0.3s ease;
        }

        // 菜单项激活时的样式 (适用于 **纯一级菜单** 和 **二级菜单项**)
        .el-menu-item.is-active {
            background-color: #ecf5ff; // 激活背景色
            color: #409eff;
            font-weight: bold;
            // 侧边高亮条
            border-left: 4px solid #409eff;
        }


        // 当 SubMenu 被打开时，给它的标题应用高亮样式
        :deep(.el-sub-menu.is-opened)>.el-sub-menu__title {
            background-color: #f4f5f7 !important;
            /* 可以使用hover色或浅蓝色 */
            color: #409eff !important;
        }

        // 当 SubMenu 的子项处于激活状态时，保持一级标题高亮
        :deep(.el-sub-menu.is-active)>.el-sub-menu__title {
            background-color: #f4f5f7 !important;
            color: #409eff !important;
        }


        // 图标的样式
        .el-icon {
            font-size: 18px;
            margin-right: 8px;
        }

        // 折叠状态下的优化... (略)
    }
}
</style>