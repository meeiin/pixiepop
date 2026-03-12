<script setup>
import { useRoute } from 'vue-router';
import footerContent from './footer-content.vue';
import HeaderContent from './header-content.vue';
import { computed, watch} from 'vue';
import { useI18n} from "vue-i18n";
import { useProjectStore } from '../../../proyect/application/project.store';
import ConfirmCardContent from './confirm-card-content.vue';

const { t, locale} = useI18n();
const route = useRoute();
const store = useProjectStore();

// Fondos para otras páginas
const pageBackground = computed(() => {
  switch (route.name) {
    case 'home': return 'bg-home';
    case 'select-frame': return 'bg-select-frame';
    case 'photo-booth': return 'bg-photo-booth';
    case 'photo-strip': return 'bg-photo-strip';
    default: return 'bg-default';
  }
});

const baseTitle = "Pixiepop";

watch([() => route.name, locale], () => {
  document.title = route.meta['title'] ? `${baseTitle} - ${t(String(route.meta['title']))}`
  : baseTitle;
},
{ immediate: true });
</script>

<template>
 <div :class="['layout-container', pageBackground]">
  <!-- Header -->
  <div class="header-content">
    <header-content />
  </div>
  <!-- Main -->
  <div class="main-content">
    <router-view />
  </div>
  <!-- Footer -->
  <div class="footer-content">
    <div class="footer-text">
      <footer-content />
    </div>
  </div>
  <confirm-card-content
  v-if="store.showConfirmCard"
  :title="store.confirmTitle"
  :description="store.confirmDescription"
  @cancel="store.closeConfirmCard"
  @confirm="store.confirmAction"
  class="confirm-overlay"/>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  font-family: "Fira Sans Condensed", sans-serif;
  margin: 0;
}

.header-content {
  flex: 0 0 71px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 clamp(12px, 3vw, 20px);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: clamp(24px, 5vw, 40px) clamp(16px, 8vw, 80px);
}

.footer-content {
  flex: 0 0 auto;
  font-family: "Fira Sans Condensed", sans-serif;
  font-size: clamp(12px, 1.5vw, 14px);
  color: #64748B;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: normal;
  min-height: 71px;
  padding: 16px 20px;
  border-top: 1px solid rgba(217, 217, 217, 0.50);
}

.bg-home {
  background: linear-gradient(135deg, #F8BDC4 0%, #F497DA 100%);
  background-size: cover;
  background-repeat: no-repeat;
}
.bg-home .footer-content{
    color: #FFFFFF;
}
.bg-home .main-content{
  justify-content: center;
}
.bg-home :deep(.language-switcher){
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid #FFFFFF;
  color: #FFFFFF;
}
.bg-home :deep(.lang-btn) {
    color: #FFFFFF !important;
}

.bg-default {
  background: white;
}
.bg-select-frame {
  background: #F8F5F8;
}
.bg-photo-booth {
  background: #F8F5F8;
}
.bg-photo-strip {
  background: #F8EAEE;
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>