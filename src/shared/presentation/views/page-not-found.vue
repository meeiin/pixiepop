<script setup>
import { routerKey, useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";

const router = useRouter();
const unavailableRoute = router.currentRoute.value.fullPath;
const { t } = useI18n();
</script>

<template>
<div class="not-found-container">
    <h1>{{  t('page-not-found.title') }}</h1>
    <p>{{  t('page-not-found.description', { 'unavailable-route': unavailableRoute }) }}</p>
    <router-link to="/home">
        <pv-button :label="t('page-not-found.button-home')" class="pv-button primary"></pv-button>
    </router-link>
</div>
</template>

<style scoped>
.not-found-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    gap: clamp(16px, 2.5vw, 24px);
    padding: clamp(24px, 5vw, 48px) clamp(16px, 5vw, 48px);
}
.not-found-container h1 {
    font-size: clamp(32px, 5vw, 48px);
    font-family: "Darumadrop One", sans-serif;
    color: #F679E5;
    margin: 0;
}
.not-found-container p{
    font-size: clamp(16px, 1.5vw, 20px);
    color: #64748B;
    text-align: center;
    max-width: 600px;
    margin: 0;
}
</style>