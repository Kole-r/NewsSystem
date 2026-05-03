<template>
    <div class="detail-page">
        <div v-if="job" class="detail-content">
            <!-- Back -->
            <router-link to="/jobs" class="back-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </router-link>

            <!-- Header -->
            <div class="detail-header">
                <div class="header-top">
                    <span class="header-label">JOB DETAIL</span>
                    <span class="header-salary">
                        {{ job.salary_min / 1000 }}<span class="salary-sep">–</span>{{ job.salary_max / 1000 }}<span class="salary-unit">K</span>
                    </span>
                </div>
                <h1 class="detail-title">{{ job.job_title }}</h1>
                <div class="detail-tags" v-if="job.tags">
                    <span class="tag" v-for="t in job.tags.split(',')" :key="t">{{ t }}</span>
                </div>
            </div>

            <!-- Company Card -->
            <div class="company-card">
                <div class="company-header">
                    <div class="company-avatar">{{ (job.company_name || 'C')[0] }}</div>
                    <div class="company-info">
                        <h3 class="company-name">{{ job.company_name }}</h3>
                        <div class="company-meta">
                            <span v-if="job.company_type">{{ job.company_type }}</span>
                            <span v-if="job.company_size">{{ job.company_size }}</span>
                        </div>
                    </div>
                </div>
                <p class="company-desc" v-if="job.company_desc">{{ job.company_desc }}</p>
            </div>

            <!-- Info Grid -->
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">CITY</span>
                    <span class="info-val">{{ job.city || '—' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">DEGREE</span>
                    <span class="info-val">{{ job.degree_required || '—' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">EXPERIENCE</span>
                    <span class="info-val">{{ job.experience || '—' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">HEADCOUNT</span>
                    <span class="info-val">{{ job.headcount || '—' }}</span>
                </div>
            </div>

            <!-- Description -->
            <div class="section">
                <h2 class="section-title">岗位描述</h2>
                <p class="section-body">{{ job.job_description }}</p>
            </div>

            <!-- Requirements -->
            <div class="section">
                <h2 class="section-title">岗位要求</h2>
                <p class="section-body">{{ job.job_requirements }}</p>
            </div>

            <!-- Benefits -->
            <div class="section" v-if="job.benefits">
                <h2 class="section-title">福利待遇</h2>
                <div class="benefits-list">
                    <span class="benefit" v-for="b in job.benefits.split(',')" :key="b">{{ b }}</span>
                </div>
            </div>
        </div>

        <div v-else class="loading">
            <span class="loading-text">[LOADING...]</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/util/axios.config.js'

const route = useRoute()
const job = ref(null)

onMounted(async () => {
    try {
        const res = await axios.get(`/webApi/job/detail/${route.params.id}`)
        if (res.data.code === 200) job.value = res.data.data
    } catch (e) { console.error(e) }
})
</script>

<style scoped>
.detail-page {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-xl) var(--space-xl) var(--space-4xl);
}

/* ── Back Button ── */
.back-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    margin-bottom: var(--space-xl);
    transition: all 150ms ease-out;
}

.back-btn:hover {
    border-color: var(--border-visible);
    color: var(--text-display);
}

/* ── Header ── */
.detail-header {
    margin-bottom: var(--space-xl);
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
}

.header-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--text-disabled);
}

.header-salary {
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 700;
    color: var(--text-display);
    line-height: 1;
}

.salary-sep {
    color: var(--text-disabled);
    margin: 0 2px;
}

.salary-unit {
    font-size: 14px;
    color: var(--text-secondary);
    margin-left: 2px;
    font-weight: 400;
}

.detail-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-display);
    margin: 0 0 var(--space-md);
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.detail-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.tag {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-disabled);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 10px;
}

/* ── Company ── */
.company-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: var(--space-lg);
    margin-bottom: var(--space-xl);
}

.company-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-sm);
}

.company-avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    flex-shrink: 0;
}

.company-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0 0 4px;
}

.company-meta {
    display: flex;
    gap: var(--space-sm);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-disabled);
}

.company-desc {
    font-size: 13px;
    color: var(--text-disabled);
    margin: 0;
    line-height: 1.6;
}

/* ── Info Grid ── */
.info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: var(--space-xl);
}

.info-item {
    background: var(--surface);
    padding: var(--space-md);
    text-align: center;
}

.info-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--text-disabled);
    display: block;
    margin-bottom: 6px;
    text-transform: uppercase;
}

.info-val {
    font-size: 15px;
    color: var(--text-primary);
    font-weight: 500;
}

/* ── Sections ── */
.section {
    margin-bottom: var(--space-xl);
}

.section-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0 0 var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border);
}

.section-body {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-secondary);
    margin: 0;
    white-space: pre-line;
}

/* ── Benefits ── */
.benefits-list {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
}

.benefit {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
    border: 1px solid var(--border-visible);
    border-radius: 999px;
    padding: 4px 14px;
}

/* ── Loading ── */
.loading {
    text-align: center;
    padding: var(--space-4xl) 0;
}

.loading-text {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-disabled);
}

/* ── Responsive ── */
@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .header-salary {
        font-size: 22px;
    }
    .detail-title {
        font-size: 24px;
    }
}
</style>
