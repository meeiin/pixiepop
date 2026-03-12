<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineProps({
  title: String,
  description: String
});
defineEmits(['confirm', 'cancel']);
</script>

<template>
<div class="confirm-wrapper">
    <div class="base-card">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>

        <div class="action-buttons">
            <pv-button class="pv-button primary" :label="t('confirm-card.button-confirm')" @click="$emit('confirm')"></pv-button>
            <pv-button class="pv-button tertiary" :label="t('confirm-card.button-cancel')" @click="$emit('cancel')"></pv-button>
        </div>
    </div>
</div>
</template>

<style scoped>
.confirm-wrapper{
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
}
</style>