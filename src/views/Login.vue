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
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'


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
// 登录逻辑
const login = () => {
    console.log(LoginForm)
    localStorage.setItem('token', '123456')
    // 这里可以添加路由跳转逻辑
}

// 提交表单
const submitForm = () => {
    //1.校验表单
    LoginFormRef.value.validate((valid: boolean) => {
        console.log('valid', valid)
        if (valid) {
            login()
        } else {
            console.log('表单验证失败')
            return false
        }
    })
    //2.获取内容提交后台

    //3.设置token
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