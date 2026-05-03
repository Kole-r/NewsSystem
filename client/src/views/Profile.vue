<template>
    <div class="profile-page">
        <div class="page-hero">
            <span class="hero-label">PROFILE</span>
            <h1 class="hero-title">个人中心</h1>
        </div>

        <div class="profile-card">
            <!-- Header -->
            <div class="profile-header">
                <div class="avatar-circle">
                    {{ avatarInitial }}
                </div>
                <div class="profile-info">
                    <h2 class="profile-name">{{ userInfo.real_name || userInfo.username }}</h2>
                    <span class="profile-sub" v-if="userInfo.major || userInfo.university">
                        {{ [userInfo.major, userInfo.university].filter(Boolean).join(' · ') }}
                    </span>
                </div>
            </div>

            <!-- Data -->
            <div class="profile-data">
                <div class="data-row" v-for="field in fields" :key="field.key">
                    <span class="data-label">{{ field.label }}</span>
                    <span class="data-val">{{ userInfo[field.key] || '—' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserInfoStore } from '../store/userInfo'

const store = useUserInfoStore()
const userInfo = computed(() => store.$state)
const avatarInitial = computed(() => (userInfo.value.real_name || userInfo.value.username || 'U')[0])

const fields = [
    { key: 'username', label: 'USERNAME' },
    { key: 'real_name', label: 'REAL NAME' },
    { key: 'major', label: 'MAJOR' },
    { key: 'degree', label: 'DEGREE' },
    { key: 'university', label: 'UNIVERSITY' },
]
</script>

<style scoped>
.profile-page {
    max-width: 640px;
    margin: 0 auto;
    padding: var(--space-xl) var(--space-xl) var(--space-4xl);
}

.page-hero {
    margin-bottom: var(--space-xl);
}

.hero-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--text-disabled);
    display: block;
    margin-bottom: var(--space-xs);
}

.hero-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-display);
    margin: 0;
    letter-spacing: -0.02em;
}

/* ── Card ── */
.profile-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
}

/* ── Header ── */
.profile-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-xl);
    border-bottom: 1px solid var(--border);
}

.avatar-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--surface-raised);
    border: 1px solid var(--border-visible);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 900;
    color: var(--text-display);
    flex-shrink: 0;
}

.profile-name {
    font-size: 20px;
    font-weight: 500;
    color: var(--text-display);
    margin: 0 0 4px;
}

.profile-sub {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-disabled);
}

/* ── Data ── */
.profile-data {
    padding: var(--space-xs) 0;
}

.data-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md) var(--space-xl);
    border-bottom: 1px solid var(--border);
    transition: background 150ms ease-out;
}

.data-row:last-child {
    border-bottom: none;
}

.data-row:hover {
    background: var(--surface-raised);
}

.data-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--text-disabled);
    text-transform: uppercase;
}

.data-val {
    font-size: 14px;
    color: var(--text-primary);
}
</style>
