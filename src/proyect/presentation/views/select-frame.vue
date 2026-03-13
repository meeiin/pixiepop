<script setup>
import { ref,onMounted, onUnmounted } from 'vue';
import { useProjectStore } from '../../application/project.store';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
import ErrorContent from '../../../shared/presentation/components/error-content.vue';

const store = useProjectStore();
const router = useRouter();
const frames = ref([]);
const loading = ref(true);
const errorMsg = ref(false);
const { t } = useI18n();

let abortController = null;

// Selecciona un frame y navega a la cámara
const chooseFrame = (frame) => {
    store.selectFrame(frame);
    router.push({ name: 'photo-booth' });
};

// Navega a la pantalla principal
const homeView = () => {
    router.push({ name: 'home' });
};

// Función para cargar los frames
const loadFrames = async () => {
    abortController?.abort(); // Cancelar cualquier solicitud anterior
    abortController = new AbortController();

    loading.value = true;
    errorMsg.value = false;
    try {
        const response = await fetch(import.meta.env.VITE_FRAMES_URL, {
            signal: abortController.signal // Conectar la señal de aborto a la solicitud
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
        }
        frames.value = data;
    } catch (error) {
        if (error.name === 'AbortError'){
            return; // Ignora cancelaciones
        }
        errorMsg.value = true;
        console.error('Error loading frames:', error);
    } finally {
        loading.value = false;
    }
};
onMounted(loadFrames);
onUnmounted(() => {
    abortController?.abort(); // Cancelar la solicitud si el componente se desmonta
});
</script>

<template>
<div class="select-frame-content">
    <div class="view-header">
        <h1>{{ $t('select-frame.title') }}</h1>
        <p>{{ $t('select-frame.description') }}</p>
    </div>
        
    <div v-if="loading" class="frames-grid">
        <div v-for="n in 4" :key="n" class="frame-skeleton">
            <div class="frame-img-skeleton"></div>
            <div class="frame-text-skeleton"></div>
        </div>
    </div>
        
    <error-content v-else-if="errorMsg" :message="t('select-frame.error.message')">
        <div class="error-actions">
            <pv-button class="pv-button primary" :label="$t('options.error.button-retry')" @click="loadFrames"></pv-button>
            <pv-button class="pv-button tertiary" :label="$t('select-frame.error.button')" @click="homeView"></pv-button>
        </div>
    </error-content>
        
    <div v-else class="frames-wrapper">
        <div class="frames-grid">
            <div
            v-for="frame in frames"
            :key="frame.id" 
            class="frame-item"
            @click="chooseFrame(frame)">
            <img :src="frame.src" :alt="frame.name"/>
                <p class="frame-name">{{ frame.name }}</p>
            </div>
        </div>
        
        <div class="action-buttons">
            <pv-button class="pv-button tertiary" :label="$t('select-frame.button-back')" @click="homeView"></pv-button>
        </div>
    </div>
</div>
</template>

<style scoped>
.select-frame-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 40px;
}
.frames-grid{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    justify-content: center;
    margin: 0 auto;
    max-width: 1200px;
    width: 100%;
}
.frame-name{
    font-size: clamp(16px, 1.5vw, 18px);
    margin: 16px;
    line-height: 1;
}
.frame-item {
  background-color: #FFFFFF;
  border-radius: clamp(12px, 3vw, 24px);
  padding: 6%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  height: auto;
}
.frame-item img{
    width: 100%;
    height: auto;
    display: block;
}
.frame-item:hover{
    transform: scale(1.05);
}
.frame-item.active{
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.select-frame-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
}
.frame-skeleton{
  background-color: #fff;
  border-radius: clamp(12px, 3vw, 24px);
  padding: 6%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  justify-content: space-between;
}

.frame-img-skeleton{
  width: 100%;
  aspect-ratio: 950/2350;
  background: linear-gradient(90deg,#f1f1f1 25%,#e6e6e6 50%,#f1f1f1 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s infinite;
}

.frame-text-skeleton{
  width: 40%;
  height: clamp(16px, 1.5vw, 18px);
  margin: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg,#f1f1f1 25%,#e6e6e6 50%,#f1f1f1 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.4s infinite;
}
.frames-wrapper {
    display: flex;
    flex-direction: column;
    gap: 62px;
    width: 100%;
}

@keyframes skeleton-loading{
  0%{
    background-position: 200% 0;
  }
  100%{
    background-position: -200% 0;
  }
}

@media (max-width: 1024px) {
    .frames-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (max-width: 768px) {
    .frames-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
}
</style>