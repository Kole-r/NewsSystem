<template>
    <div>
        <el-page-header content="首页" icon="" title="企业门户网站后台管理系统" />
        <el-card class="box-card">
            <el-row>
                <!-- 头像 -->
                <el-col :span="4">
                    <el-avatar :size="100" :src="avatarUrl" />
                </el-col>
                <!-- 欢迎语 -->
                <el-col :span="20">
                    <h3 style="line-height: 100px">
                        欢迎 {{ userInfo.$state.username}} 回来, {{ welcomeText }}
                    </h3>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <h4>公司产品</h4>
                </div>
            </template>
            <!-- 轮播图(走马灯) -->
            <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item v-for="item in 6" :key="item">
                    <h3 text="2xl" justify="center">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
        </el-card>
    </div>
</template>

<script setup>
import useUserInfoStore from '../../store/userInfo.js';
import { computed } from 'vue';
const{avatar}=useUserInfoStore().$state;
const userInfo = useUserInfoStore();
const avatarUrl = computed(() => avatar ? 'http://localhost:3000'+avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
const welcomeText = computed(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
        return '上午好！祝您有个美好的一天！';
    } else if (hours < 18) {
        return '下午好！工作顺利哦！';
    } else {
        return '晚上好！注意休息哦！';
    }
});
</script>
<style scoped lang="scss">
.box-card {
    margin-top: 50px;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>
