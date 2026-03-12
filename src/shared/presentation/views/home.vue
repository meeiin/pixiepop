<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const selectFrame = () => {
  router.push({name: 'select-frame'});
};
</script>

<template>
<div class="home-content">
  <div class="home-header">
    <h1>{{ t('home.title') }} <br>
      {{ t('home.title2') }} <br>
    <span class="highlight">{{ t('home.title3') }}</span></h1>
    <p>{{ t('home.description') }}</p>
  </div>
  <pv-button :label="t('home.button-start')" class="pv-button primary" @click="selectFrame"></pv-button>
</div>
</template>

<style scoped>
.home-content {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 48px);
  justify-content: center;
  align-items: center;
  text-align: center;
  transform: translateY(-10%);
}

.home-header {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 32px);
}

.home-header h1 {
  font-size: clamp(72px, 7vw, 80px);
  font-family: "Darumadrop One", sans-serif;
  font-weight: normal;
  line-height: 1.1;
  color: #FFFFFF;
  margin: 0;
}

.home-header p{
  margin: 0;
  font-size: clamp(16px, 1.8vw, 20px);
  font-family: "Fira Sans Condensed", sans-serif;
  color: #FFFFFF;
}

.highlight {
  font-family: "Darumadrop One", sans-serif;
  font-size: clamp(72px, 7vw, 80px);
  line-height: 1.1;
  color: #DEF6CA;
  font-weight: 100;
}
@media (max-width: 768px) {
  .home-content {
    transform: translateY(0);
  }
}
</style>