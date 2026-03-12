<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineProps({
    message: String
});
</script>

<template>
<div class="error-wrapper">
    <div class="base-card">
        <h2>{{ $t('options.error.title') }}</h2>
        <p>{{ message }}</p>
        <slot></slot>
    </div>
</div>
</template>

<style scoped>
.error-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>