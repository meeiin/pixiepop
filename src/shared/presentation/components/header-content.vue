<script setup>
import { useI18n } from "vue-i18n";
const { t, locale, availableLocales } = useI18n();
</script>

<template>
<div class="header-content">
    <div class="language-switcher">
        <pv-button v-for="lang in availableLocales"
        :key="lang"
        :class="['lang-btn', { active: locale === lang }]"
        @click="locale = lang">
        {{ lang.toUpperCase() }}</pv-button>
    </div>
</div>
</template>

<style scoped>
.language-switcher {
    display: flex;
    gap: 4px;
    background: rgba(244, 151, 212, 0.2);
    border-radius: 24px;
    padding: 4px;
    border: 1px solid #F497D4;
}

.lang-btn {
    background: transparent !important;
    border: none !important;
    color: #F65AE4 !important;
    font-family: "Fira Sans Condensed", sans-serif !important;
    font-size: clamp(12px, 1.5vw, 16px) !important;
    padding: clamp(4px, 1vw, 6px) clamp(10px, 2vw, 16px) !important;
    border-radius: 20px !important;
    box-shadow: none !important;
}

.lang-btn.active {
    background: #F65AE4 !important;
    color: #fff !important;
}
</style>