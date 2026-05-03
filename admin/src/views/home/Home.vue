<template>
    <div class="home-page">
        <!-- Hero Greeting -->
        <div class="hero-section">
            <div class="hero-left">
                <span class="hero-label">DASHBOARD</span>
                <h1 class="hero-greeting">{{ welcomeText }}</h1>
                <p class="hero-sub">{{ userInfo.$state.username }}，欢迎回来</p>
            </div>
            <div class="hero-right">
                <div class="user-card">
                    <div class="user-avatar-wrap">
                        <img :src="avatarUrl" alt="avatar" class="user-avatar" />
                    </div>
                    <div class="user-meta">
                        <span class="meta-label">ROLE</span>
                        <span class="meta-value">{{ userInfo.$state.role === 1 ? '管理员' : '编辑者' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Time Display -->
        <div class="time-bar">
            <div class="time-display">
                <span class="time-value">{{ currentTime }}</span>
                <span class="time-date">{{ currentDate }}</span>
            </div>
            <div class="time-divider"></div>
            <div class="quick-stats">
                <div class="qstat">
                    <span class="qstat-label">SYSTEM</span>
                    <span class="qstat-value online">ONLINE</span>
                </div>
                <div class="qstat">
                    <span class="qstat-label">VERSION</span>
                    <span class="qstat-value">1.0.0</span>
                </div>
            </div>
        </div>

        <!-- Products Section -->
        <div class="section-block">
            <div class="section-head">
                <span class="section-label">COMPANY PRODUCTS</span>
                <span class="section-count">{{ products.length }} ITEMS</span>
            </div>
            <div class="product-grid">
                <div v-for="item in products" :key="item.id" class="product-card">
                    <div class="product-thumb">
                        <span class="product-index">{{ String(item.id).padStart(2, '0') }}</span>
                    </div>
                    <div class="product-info">
                        <span class="product-name">{{ item.name }}</span>
                        <span class="product-desc">{{ item.desc }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import useUserInfoStore from '../../store/userInfo.js';
import { computed, ref, onMounted, onUnmounted } from 'vue';
const userInfo = useUserInfoStore();
const avatarUrl = computed(() => userInfo.$state.avatar ? userInfo.$state.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');

const welcomeText = computed(() => {
    const hours = new Date().getHours();
    if (hours < 12) return '早上好';
    if (hours < 18) return '下午好';
    return '晚上好';
});

const currentTime = ref('');
const currentDate = ref('');
let timer = null;

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    currentDate.value = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
};

onMounted(() => {
    updateTime();
    timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});

const products = ref([
    { id: 1, name: '智能招聘平台', desc: 'AI 驱动的人才匹配系统' },
    { id: 2, name: '职业培训中心', desc: '在线技能提升课程' },
    { id: 3, name: '就业数据分析', desc: '行业趋势与薪资报告' },
    { id: 4, name: '简历优化工具', desc: '专业简历模板与建议' },
    { id: 5, name: '面试辅导系统', desc: 'AI 模拟面试训练' },
    { id: 6, name: '企业合作对接', desc: '校企合作桥梁平台' },
]);
</script>

<style lang="scss" scoped>
/* ── Tokens ── */
$black: #000000;
$surface: #0A0A0A;
$surface-1: #111111;
$surface-2: #161616;
$border: #1E1E1E;
$border-hi: #2A2A2A;
$g1: #333333;
$g2: #555555;
$g3: #888888;
$g4: #AAAAAA;
$g5: #CCCCCC;
$white: #F0F0F0;
$pure: #FFFFFF;
$accent: #D71921;
$green: #3DDC84;
$amber: #D4A843;
$blue: #5B9BF6;

.home-page {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    color: $g5;
    background: $black;
    min-height: 100vh;
    padding: 32px 40px 64px;
}

/* ── Hero ── */
.hero-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
}

.hero-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: $g3;
    display: block;
    margin-bottom: 12px;
}

.hero-greeting {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 56px;
    font-weight: 700;
    color: $pure;
    margin: 0;
    letter-spacing: -0.03em;
    line-height: 1;
}

.hero-sub {
    font-size: 16px;
    color: $g3;
    margin: 16px 0 0;
}

.user-card {
    display: flex;
    align-items: center;
    gap: 20px;
    background: $surface-1;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 16px 24px;
}

.user-avatar-wrap {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid $border-hi;
    flex-shrink: 0;
}

.user-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.user-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.meta-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: $g2;
}

.meta-value {
    font-size: 15px;
    color: $g5;
    font-weight: 500;
}

/* ── Time Bar ── */
.time-bar {
    display: flex;
    align-items: center;
    gap: 32px;
    background: $surface-1;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 20px 28px;
    margin-bottom: 48px;
}

.time-display {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.time-value {
    font-family: 'Space Mono', monospace;
    font-size: 28px;
    font-weight: 700;
    color: $pure;
    letter-spacing: -0.02em;
    line-height: 1;
}

.time-date {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: $g3;
    letter-spacing: 0.02em;
}

.time-divider {
    width: 1px;
    height: 40px;
    background: $border-hi;
}

.quick-stats {
    display: flex;
    gap: 32px;
}

.qstat {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.qstat-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: $g2;
}

.qstat-value {
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    color: $g5;

    &.online { color: $green; }
}

/* ── Section ── */
.section-block {
    margin-bottom: 32px;
}

.section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: $g3;
}

.section-count {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    color: $g2;
}

/* ── Product Grid ── */
.product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.product-card {
    background: $surface-1;
    border: 1px solid $border;
    border-radius: 12px;
    padding: 24px;
    transition: border-color 150ms ease-out;
    cursor: default;

    &:hover { border-color: $border-hi; }
}

.product-thumb {
    width: 100%;
    height: 80px;
    background: $surface-2;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.product-index {
    font-family: 'Space Mono', monospace;
    font-size: 28px;
    font-weight: 700;
    color: $g1;
    letter-spacing: -0.02em;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.product-name {
    font-size: 15px;
    font-weight: 500;
    color: $white;
}

.product-desc {
    font-size: 13px;
    color: $g3;
}
</style>
