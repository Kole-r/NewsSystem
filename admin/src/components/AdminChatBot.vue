<template>
    <div class="admin-chatbot" :style="containerStyle">
        <!-- Trigger -->
        <div class="chatbot-trigger" @mousedown="onDragStart" @touchstart="onDragStart" @click="toggleChat" :class="{ active: isOpen }">
            <span class="trigger-icon" v-if="!isOpen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            </span>
            <span class="trigger-icon" v-else>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </span>
        </div>

        <!-- Window -->
        <transition name="chat-expand">
            <div class="chat-window" :class="windowPosition" v-show="isOpen">
                <div class="chat-header">
                    <div class="header-left">
                        <div class="ai-avatar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <div class="header-text">
                            <span class="header-title">写作助手</span>
                            <span class="header-sub">MiMo AI</span>
                        </div>
                    </div>
                    <button class="close-btn" @click="toggleChat">[ X ]</button>
                </div>

                <!-- Quick Actions -->
                <div class="quick-bar">
                    <button
                        v-for="action in quickActions"
                        :key="action.type"
                        :class="['qbtn', { active: activeType === action.type }]"
                        @click="selectType(action)"
                    >{{ action.label }}</button>
                </div>

                <!-- Messages -->
                <div class="chat-messages" ref="messagesContainer">
                    <div v-if="messages.length === 0" class="welcome">
                        <div class="welcome-hero">AI</div>
                        <p class="welcome-desc">管理端写作辅助，支持新闻选题、内容扩写、岗位描述生成。</p>
                    </div>

                    <div v-for="(msg, index) in messages" :key="index" class="message" :class="msg.role">
                        <div class="message-meta">
                            <span class="message-role">{{ msg.role === 'user' ? 'YOU' : 'AI' }}</span>
                        </div>
                        <div class="message-content">
                            <div class="message-text" v-html="formatMessage(msg.content)"></div>
                            <button v-if="msg.role === 'assistant' && msg.content" class="copy-btn" @click="copyToClipboard(msg.content)">COPY</button>
                        </div>
                    </div>

                    <div v-if="isLoading" class="message assistant">
                        <div class="message-meta"><span class="message-role">AI</span></div>
                        <div class="message-content">
                            <span class="loading-text">[ GENERATING... ]</span>
                        </div>
                    </div>
                </div>

                <!-- Input -->
                <div class="chat-input">
                    <textarea
                        ref="inputRef"
                        v-model="inputMessage"
                        @keydown.enter.exact.prevent="sendMessage"
                        :placeholder="placeholder"
                        :disabled="isLoading"
                        rows="2"
                    ></textarea>
                    <div class="input-actions">
                        <span class="input-hint">{{ activeType ? quickActions.find(a => a.type === activeType)?.label : '通用模式' }}</span>
                        <button class="send-btn" @click="sendMessage" :disabled="isLoading || !inputMessage.trim()">
                            {{ isLoading ? '...' : 'SEND' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';
import axios from '@/util/axios.config.js';

const props = defineProps({
    context: { type: String, default: '' }
});

const emit = defineEmits(['insert']);

const isOpen = ref(false);
const inputMessage = ref('');
const messages = ref([]);
const isLoading = ref(false);
const messagesContainer = ref(null);
const inputRef = ref(null);
const activeType = ref('');

const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const hasMoved = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const containerStyle = ref({});
const windowPosition = ref('top');

const quickActions = [
    { type: 'news_topic', label: '新闻选题' },
    { type: 'news_expand', label: '内容扩写' },
    { type: 'job_desc', label: '岗位描述' },
    { type: 'job_classify', label: '自动分类' },
];

const placeholder = computed(() => {
    const map = {
        'news_topic': '描述你想要的新闻主题方向...',
        'news_expand': '粘贴需要扩写的要点...',
        'job_desc': '描述岗位基本信息...',
        'job_classify': '粘贴岗位名称和描述...',
    };
    return map[activeType.value] || '输入你的需求...';
});

const updateContainerStyle = () => {
    const inBottomHalf = position.value.y > window.innerHeight / 2;
    windowPosition.value = inBottomHalf ? 'top' : 'bottom';
    containerStyle.value = {
        left: `${position.value.x}px`,
        top: `${position.value.y}px`,
        right: 'auto',
        bottom: 'auto',
        '--trigger-y': `${position.value.y}px`
    };
};

const onDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragOffset.value = { x: clientX - position.value.x, y: clientY - position.value.y };
    isDragging.value = true;
    hasMoved.value = false;
};

const onDragMove = (e) => {
    if (!isDragging.value) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const newX = clientX - dragOffset.value.x;
    const newY = clientY - dragOffset.value.y;
    if (Math.abs(newX - position.value.x) > 3 || Math.abs(newY - position.value.y) > 3) hasMoved.value = true;
    position.value = {
        x: Math.max(0, Math.min(newX, window.innerWidth - 48)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 48))
    };
    updateContainerStyle();
};

const onDragEnd = () => { isDragging.value = false; };

const toggleChat = () => {
    if (hasMoved.value) return;
    isOpen.value = !isOpen.value;
    if (isOpen.value) setTimeout(() => inputRef.value?.focus(), 300);
};

onMounted(() => {
    position.value = { x: window.innerWidth - 48 - 24, y: window.innerHeight - 48 - 24 };
    updateContainerStyle();
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
});

onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('mouseup', onDragEnd);
    window.removeEventListener('touchmove', onDragMove);
    window.removeEventListener('touchend', onDragEnd);
});

const selectType = (action) => {
    activeType.value = activeType.value === action.type ? '' : action.type;
};

const formatMessage = (content) => content.replace(/\n/g, '<br>');

const scrollToBottom = async () => {
    await nextTick();
    messagesContainer.value?.scrollTo({ top: messagesContainer.value.scrollHeight, behavior: 'smooth' });
};

const copyToClipboard = async (text) => {
    try {
        const clean = text.replace(/<br>/g, '\n');
        await navigator.clipboard.writeText(clean);
    } catch (e) {
        console.error('Copy failed', e);
    }
};

const sendMessage = async () => {
    const question = inputMessage.value.trim();
    if (!question || isLoading.value) return;

    messages.value.push({ role: 'user', content: question });
    inputMessage.value = '';
    isLoading.value = true;

    try {
        let prompt = question;
        if (props.context) {
            prompt = `当前上下文：\n${props.context}\n\n用户需求：${question}`;
        }

        const res = await axios.post('/adminApi/ai/chat', {
            prompt,
            type: activeType.value || 'general'
        });

        const answer = res.data.data?.answer || '未能获取回答';
        messages.value.push({ role: 'assistant', content: answer });
    } catch (error) {
        messages.value.push({ role: 'assistant', content: '[ERROR] AI 服务暂时不可用' });
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
};
</script>

<style lang="scss" scoped>
$black: #000000;
$surface: #111111;
$surface-raised: #1A1A1A;
$border: #222222;
$border-vis: #333333;
$g1: #666666;
$g2: #999999;
$g3: #CCCCCC;
$white: #E8E8E8;
$pure: #FFFFFF;
$accent: #D71921;
$blue: #5B9BF6;

.admin-chatbot {
    position: fixed;
    z-index: 9998;
    font-family: 'Space Grotesk', sans-serif;
}

.chatbot-trigger {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $surface;
    border: 1px solid $border-vis;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 200ms ease-out;

    &:hover { border-color: $g2; }
    &.active { background: $surface-raised; border-color: $white; }
}

.trigger-icon { color: $white; display: flex; }

.chat-window {
    position: absolute;
    right: 0;
    width: 440px;
    max-height: min(640px, calc(100vh - 120px));
    background: $black;
    border-radius: 16px;
    border: 1px solid $border-vis;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &.top { bottom: 64px; }
    &.bottom { top: 64px; }
}

.chat-expand-enter-active { transition: opacity 300ms ease-out; }
.chat-expand-leave-active { transition: opacity 200ms ease-out; }
.chat-expand-enter-from, .chat-expand-leave-to { opacity: 0; }

.chat-header {
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: $surface;
    border-bottom: 1px solid $border;
}

.header-left { display: flex; align-items: center; gap: 10px; }

.ai-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: $surface-raised;
    border: 1px solid $border-vis;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $accent;
}

.header-text { display: flex; flex-direction: column; gap: 1px; }

.header-title {
    font-size: 14px;
    font-weight: 500;
    color: $pure;
}

.header-sub {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: $g1;
    letter-spacing: 0.06em;
}

.close-btn {
    background: transparent;
    border: none;
    color: $g1;
    cursor: pointer;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    padding: 8px;
    transition: color 200ms;
    &:hover { color: $pure; }
}

.quick-bar {
    display: flex;
    gap: 4px;
    padding: 10px 16px;
    background: $surface;
    border-bottom: 1px solid $border;
    overflow-x: auto;
}

.qbtn {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid $border-vis;
    background: transparent;
    color: $g1;
    cursor: pointer;
    white-space: nowrap;
    transition: all 150ms ease-out;

    &:hover { border-color: $g2; color: $g2; }
    &.active {
        border-color: $pure;
        color: $pure;
        background: $surface-raised;
    }
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px;
    background: $black;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 200px;
    max-height: 360px;
}

.welcome {
    padding: 32px 0;
}

.welcome-hero {
    font-family: 'Space Mono', monospace;
    font-size: 56px;
    font-weight: 700;
    color: $pure;
    line-height: 1;
    margin-bottom: 12px;
}

.welcome-desc {
    font-size: 13px;
    color: $g2;
    line-height: 1.5;
    margin: 0;
    max-width: 280px;
}

.message {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &.user { align-items: flex-end; }
    &.assistant { align-items: flex-start; }
}

.message-meta { padding: 0 4px; }

.message-role {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: $g1;
    letter-spacing: 0.08em;
}

.message.user .message-role { color: $g2; }

.message-content {
    max-width: 88%;
    padding: 10px 14px;
    font-size: 13px;
    line-height: 1.6;
    position: relative;
}

.message.assistant .message-content {
    background: $surface;
    border: 1px solid $border;
    border-radius: 4px 12px 12px 12px;
    color: $white;
}

.message.user .message-content {
    background: $surface-raised;
    border: 1px solid $border-vis;
    border-radius: 12px 12px 4px 12px;
    color: $pure;
}

.copy-btn {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid $border-vis;
    background: transparent;
    color: $g1;
    cursor: pointer;
    margin-top: 8px;
    transition: all 150ms;

    &:hover { border-color: $g2; color: $g2; }
}

.loading-text {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: $g1;
    letter-spacing: 0.06em;
    animation: blink 1.5s step-end infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.chat-input {
    padding: 14px 16px;
    background: $surface;
    border-top: 1px solid $border;
}

.chat-input textarea {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid $border-vis;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    color: $white;
    outline: none;
    resize: none;
    padding: 8px 4px;
    box-sizing: border-box;
    transition: border-color 200ms;

    &:focus { border-bottom-color: $white; }
    &::placeholder { color: $g1; }
    &:disabled { opacity: 0.4; }
}

.input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.input-hint {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: $g1;
    letter-spacing: 0.04em;
}

.send-btn {
    padding: 8px 18px;
    border-radius: 999px;
    background: transparent;
    border: 1px solid $border-vis;
    color: $g1;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 150ms;

    &:hover:not(:disabled) { border-color: $white; color: $white; }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
}

.chat-messages::-webkit-scrollbar { width: 2px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: $border-vis; }
</style>
