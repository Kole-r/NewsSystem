<template>
    <div class="mainbox">
        <Navbar />
        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
</script>

<style scoped>
.mainbox {
    background: var(--black);
    min-height: 100vh;
    color: var(--text-primary);
}

.main-content {
    padding-top: 64px;
}
</style>
