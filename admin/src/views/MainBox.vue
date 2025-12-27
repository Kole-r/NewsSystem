<template>
    <el-container>
        <SideMenu/>
        <el-container direction="vertical">
            <TopHeader/>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import TopHeader from '../components/mainbox/TopHeader.vue';
import SideMenu from '../components/mainbox/SideMenu.vue';
</script>
<style lang="scss" scoped>
.el-main {
    overflow:auto;
    padding: 20px;
    height: calc(100vh - 112px);
    background-color: #f5f7fa;
    min-height: calc(100vh - 64px);
}
</style>