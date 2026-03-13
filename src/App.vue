<script setup>
import Layout from './shared/presentation/components/layout.vue';
import { useI18n } from "vue-i18n";
import { SpeedInsights } from '@vercel/speed-insights/vue';

const { t } = useI18n();
</script>

<template>
  <Layout />
  <SpeedInsights />
</template>

<style>
</style>