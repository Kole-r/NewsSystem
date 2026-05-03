<template>
    <div class="users-page">
        <!-- Hero -->
        <div class="page-hero">
            <div class="hero-left">
                <span class="hero-label">USER MANAGEMENT</span>
                <h1 class="hero-title">用户列表</h1>
            </div>
            <div class="hero-right">
                <div class="stat-block">
                    <span class="stat-num">{{ tableData.length }}</span>
                    <span class="stat-label">TOTAL</span>
                </div>
                <div class="stat-block">
                    <span class="stat-num">{{ tableData.filter(u => u.role === 1).length }}</span>
                    <span class="stat-label">ADMINS</span>
                </div>
            </div>
        </div>

        <!-- Status Msg -->
        <div v-if="statusMsg" class="status-msg">{{ statusMsg }}</div>

        <!-- Table -->
        <div class="table-wrap">
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="col-index">#</th>
                        <th class="col-avatar">头像</th>
                        <th class="col-name">用户名</th>
                        <th class="col-role">角色</th>
                        <th class="col-intro">简介</th>
                        <th class="col-actions">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="item.id">
                        <td class="col-index">{{ index + 1 }}</td>
                        <td class="col-avatar">
                            <div class="avatar-thumb">
                                <img :src="item.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" alt="" />
                            </div>
                        </td>
                        <td class="col-name">
                            <span class="name-text">{{ item.username }}</span>
                        </td>
                        <td class="col-role">
                            <span :class="['role-pill', item.role === 1 ? 'admin' : 'editor']">
                                {{ item.role === 1 ? '管理员' : '编辑者' }}
                            </span>
                        </td>
                        <td class="col-intro">
                            <span class="intro-text">{{ item.introduction || '—' }}</span>
                        </td>
                        <td class="col-actions">
                            <button class="abtn abtn-edit" @click="handleEdit(item)">编辑</button>
                            <button class="abtn abtn-delete" @click="handleDelete(item)">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="tableData.length === 0" class="empty-state">
                <span class="empty-label">NO DATA</span>
                <span class="empty-desc">暂无用户数据</span>
            </div>
        </div>

        <!-- Edit Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="editVisible" class="modal-backdrop" @click.self="editVisible = false">
                    <div class="edit-modal">
                        <div class="modal-top">
                            <span class="modal-tag">EDIT USER</span>
                            <button class="modal-close" @click="editVisible = false">&times;</button>
                        </div>
                        <div class="edit-scroll">
                            <div class="form-group">
                                <label class="form-label">用户名</label>
                                <input v-model="userForm.username" type="text" class="form-input" placeholder="请输入用户名" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">密码</label>
                                <input v-model="userForm.password" type="password" class="form-input" placeholder="留空则不修改" />
                            </div>
                            <div class="form-group">
                                <label class="form-label">角色</label>
                                <div class="select-wrap">
                                    <select v-model="userForm.role" class="form-select">
                                        <option value="1">管理员</option>
                                        <option value="2">编辑者</option>
                                    </select>
                                    <span class="select-arrow">&#9662;</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">个人简介</label>
                                <textarea v-model="userForm.introduction" class="form-textarea" rows="3" placeholder="请输入个人简介"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">头像</label>
                                <Upload :avatar="userForm.avatar" @koleChange="handleChange" />
                            </div>
                        </div>
                        <div class="modal-foot">
                            <button class="abtn abtn-cancel" @click="editVisible = false">取消</button>
                            <button class="abtn abtn-save" @click="handleConfirm">保存</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from '../../util/axios.config.js';
import Upload from '@/components/upload/Upload.vue';

const editVisible = ref(false);
const currentUserId = ref(null);
const statusMsg = ref('');
const tableData = ref([]);

const userForm = reactive({
    username: '',
    password: '',
    role: '2',
    introduction: '',
    avatar: '',
});

const showStatus = (msg) => {
    statusMsg.value = msg;
    setTimeout(() => { statusMsg.value = ''; }, 3000);
};

const handleChange = (file) => {
    userForm.avatar = URL.createObjectURL(file);
    userForm.file = file;
};

const handleConfirm = async () => {
    if (!userForm.username) {
        showStatus('[ERROR] 请输入用户名');
        return;
    }
    try {
        await axios.put(`/adminApi/user/list/${currentUserId.value}`, userForm);
        editVisible.value = false;
        showStatus('[SAVED]');
        fetchUserList();
    } catch (error) {
        showStatus('[ERROR] 更新失败');
    }
};

const fetchUserList = async () => {
    try {
        const response = await axios.get('/adminApi/user/list');
        tableData.value = response.data.data;
    } catch (error) {
        showStatus('[ERROR] 获取用户列表失败');
    }
};

onMounted(fetchUserList);

const handleEdit = async (data) => {
    try {
        const res = await axios.get(`/adminApi/user/list/${data.id}`);
        const userData = res.data.data[0];
        currentUserId.value = userData.id;
        userForm.username = userData.username;
        userForm.role = String(userData.role);
        userForm.introduction = userData.introduction || '';
        userForm.avatar = userData.avatar || '';
        userForm.password = '';
        editVisible.value = true;
    } catch (error) {
        showStatus('[ERROR] 获取用户信息失败');
    }
};

const handleDelete = async (data) => {
    try {
        await axios.delete(`/adminApi/user/delete/${data.id}`);
        tableData.value = tableData.value.filter(user => user.id !== data.id);
        showStatus('[DELETED]');
    } catch (error) {
        showStatus('[ERROR] 删除失败');
    }
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');

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

.users-page {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    color: $g5;
    background: $black;
    min-height: 100vh;
    padding: 32px 40px 64px;
}

/* ── Hero ── */
.page-hero {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
}

.hero-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: $g3;
    display: block;
    margin-bottom: 8px;
}

.hero-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 36px;
    font-weight: 700;
    color: $pure;
    margin: 0;
    letter-spacing: -0.02em;
}

.hero-right {
    display: flex;
    gap: 32px;
}

.stat-block { text-align: right; }

.stat-num {
    font-family: 'Space Mono', monospace;
    font-size: 32px;
    font-weight: 700;
    color: $pure;
    display: block;
    line-height: 1;
}

.stat-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: $g2;
    margin-top: 4px;
    display: block;
}

/* ── Status ── */
.status-msg {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.04em;
    color: $g4;
    margin-bottom: 16px;
}

/* ── Table ── */
.table-wrap {
    border: 1px solid $border;
    border-radius: 12px;
    overflow: hidden;
    background: $surface;
}

.data-table {
    width: 100%;
    border-collapse: collapse;

    th {
        font-family: 'Space Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: $g2;
        text-align: left;
        padding: 14px 16px;
        border-bottom: 1px solid $border-hi;
        background: $surface-1;
    }

    td {
        padding: 14px 16px;
        border-bottom: 1px solid $border;
        vertical-align: middle;
        font-size: 14px;
        color: $g5;
    }

    tbody tr {
        transition: background 100ms;

        &:hover { background: $surface-2; }
        &:last-child td { border-bottom: none; }
    }
}

.col-index {
    width: 50px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: $g2;
}

.col-avatar { width: 70px; }

.avatar-thumb {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid $border-hi;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
}

.col-name { min-width: 140px; }

.name-text {
    color: $white;
    font-weight: 500;
}

.col-role { width: 100px; }

.role-pill {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    border: 1px solid;
    border-radius: 999px;
    padding: 3px 10px;

    &.admin {
        border-color: $accent;
        color: $accent;
    }
    &.editor {
        border-color: $border-hi;
        color: $g4;
    }
}

.col-intro {
    max-width: 260px;
}

.intro-text {
    font-size: 13px;
    color: $g3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.col-actions { width: 160px; }

/* ── Action Buttons ── */
.abtn {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid;
    background: transparent;
    cursor: pointer;
    transition: all 150ms ease-out;
    margin-right: 6px;

    &:last-child { margin-right: 0; }
}

.abtn-edit {
    border-color: $g4;
    color: $g4;
    &:hover { background: $g4; color: $black; }
}

.abtn-delete {
    border-color: $accent;
    color: $accent;
    &:hover { background: $accent; color: $pure; }
}

.abtn-cancel {
    border-color: $g2;
    color: $g3;
    &:hover { border-color: $g4; color: $g5; }
}

.abtn-save {
    border-color: $pure;
    color: $pure;
    &:hover { background: $pure; color: $black; }
}

/* ── Empty ── */
.empty-state {
    text-align: center;
    padding: 64px 0;

    .empty-label {
        font-family: 'Space Mono', monospace;
        font-size: 14px;
        letter-spacing: 0.1em;
        color: $g2;
        display: block;
    }

    .empty-desc {
        font-size: 13px;
        color: $g1;
        margin-top: 8px;
        display: block;
    }
}

/* ── Modal ── */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.edit-modal {
    background: $surface;
    border: 1px solid $border-hi;
    border-radius: 16px;
    width: 560px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
}

.modal-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid $border;
    flex-shrink: 0;
}

.modal-tag {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: $g3;
}

.modal-close {
    font-size: 20px;
    background: transparent;
    border: none;
    color: $g3;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    transition: color 150ms;
    &:hover { color: $pure; }
}

.edit-scroll {
    padding: 28px 24px;
    overflow-y: auto;
    flex: 1;
}

.modal-foot {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid $border;
    flex-shrink: 0;
}

/* ── Form ── */
.form-group {
    margin-bottom: 20px;

    &:last-child { margin-bottom: 0; }
}

.form-label {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $g3;
    display: block;
    margin-bottom: 8px;
}

.form-input {
    width: 100%;
    background: $surface-2;
    border: 1px solid $border-hi;
    border-radius: 8px;
    padding: 11px 14px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    color: $white;
    outline: none;
    transition: border-color 150ms ease-out;
    box-sizing: border-box;

    &::placeholder { color: $g1; }
    &:focus { border-color: $g4; }
}

.select-wrap {
    position: relative;
}

.form-select {
    width: 100%;
    background: $surface-2;
    border: 1px solid $border-hi;
    border-radius: 8px;
    padding: 11px 14px;
    padding-right: 40px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    color: $white;
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 150ms ease-out;
    box-sizing: border-box;

    &:focus { border-color: $g4; }
}

.select-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: $g3;
    pointer-events: none;
}

.form-textarea {
    width: 100%;
    background: $surface-2;
    border: 1px solid $border-hi;
    border-radius: 8px;
    padding: 11px 14px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    color: $white;
    outline: none;
    resize: vertical;
    transition: border-color 150ms ease-out;
    box-sizing: border-box;

    &::placeholder { color: $g1; }
    &:focus { border-color: $g4; }
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 200ms ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
