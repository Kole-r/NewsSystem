<template>
    <div>
        <vue-particles id="tsparticles" :options="options" />
        <div class="login-container">
            <h3>企业门户网络管理系统</h3>
            <el-form ref="LoginFormRef" :model="LoginForm" status-icon :rules="Loginrules" label-width="80px"
                class="login-form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="LoginForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="LoginForm.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">
                        登陆
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../util/axios.config.js'
import { ElMessage } from 'element-plus'
import useUserInfoStore from '../store/userInfo.js'


//表单绑定的响应式对象
const LoginForm = reactive({
    username: '',
    password: ''
})
//表单的引用对象
const LoginFormRef = ref()

// 表单验证规则
const Loginrules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur', },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符之间', trigger: 'blur' }
    ]
})
const router = useRouter()
const userInfoStore = useUserInfoStore()
// 提交表单
const submitForm = () => {
    //1.表单验证
    LoginFormRef.value.validate((valid) => {
        if (valid) {
            axios.post("/adminApi/user/login", LoginForm).then(res => {
                console.log('登录响应:', res.data);
                if (res.data.code === 200) {
                    // 登录成功
                    console.log('登录成功！');
                    // 存储token到localStorage
                    // localStorage.setItem('token', res.data.data.token);
                    console.log('登录响应数据:', res.data.data);
                    userInfoStore.setUserInfo(res.data.data); // 存储用户信息到 Pinia Store
                    console.log('用户信息:', userInfoStore.$state);
                    // 跳转到首页
                    router.push('/');
                } else {
                    // 登录失败
                    ElMessage.error('Username or password is incorrect!!!');
                    console.error('登录失败:', res.data.message);
                }
            }).catch(error => {
                console.error('登录请求失败:', error);
                if (error.response && error.response.data) {
                    console.error('错误信息:', error.response.data.message);
                }
            });
        }
    });
    //2.验证通过后，发送登录请求

    //3.登录成功后，存储token，跳转首页
}

// 粒子背景配置
const options = {
    background: {
        color: {
            value: '#05131c'
        }
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            },
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: '#ffffff'
        },
        links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: 'bounce',
            random: false,
            speed: 6,
            straight: false
        },
        number: {
            density: {
                enable: true,
            },
            value: 80
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: 'circle'
        },
        size: {
            value: { min: 1, max: 5 }
        }
    },
    detectRetina: true
}
</script>

<style scoped lang="scss">
.login-container {
    width: 500px;
    height: auto;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.85);
    color: #000;
    text-align: center;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);

    .el-form {
        margin-top: 10px;
    }

    .el-button {
        width: 50%;
        margin-top: 15px;
        border-radius: 6px;
        padding: 12px 0;
    }

    .el-input {
        border-radius: 6px;
        margin-bottom: 5px;
    }

    h2 {
        margin-bottom: 25px;
        color: #2c3e50;
        font-weight: 500;
    }

    h3 {
        margin-bottom: 20px;
        color: #2c3e50;
        font-weight: 400;
    }

    .login-from {
        margin-top: 20px;
    }
}

:deep(.el-form-item__label) {
    color: #34495e;
    font-weight: 500;
}
</style>