<script setup>
import { useProjectStore } from '../../application/project.store';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
import ErrorContent from '../../../shared/presentation/components/error-content.vue';

const store = useProjectStore();
const router = useRouter();
const canvas = ref(null);
const stripGenerated = ref(false);
const errorMsg = ref(false);
const { t } = useI18n();

// Carga una imagen desde un src
const loadImage = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

const drawImageCover = (ctx, img, dx, dy, dw, dh) => {
    const imgRatio = img.width / img.height
    const slotRatio = dw / dh

    let sx, sy, sw, sh

    if (imgRatio > slotRatio) {
        sh = img.height
        sw = sh * slotRatio
        sx = (img.width - sw) / 2
        sy = 0
    } else {
        sw = img.width
        sh = sw / slotRatio
        sx = 0
        sy = (img.height - sh) / 2
    }

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

const drawStrip = async (ctx, images, frame) => {
    drawImageCover(ctx, images[0], 75, 100, 800, 600)
    drawImageCover(ctx, images[1], 75, 775, 800, 600)
    drawImageCover(ctx, images[2], 75, 1450, 800, 600)
    if(frame) ctx.drawImage(frame, 0, 0, 950, 2350)
};

// Genera la tira de fotos y la almacena
const generateStrip = async () => {
    if(store.photos.length !== 3) return;
    const canvasElement = canvas.value;
    const dpr = window.devicePixelRatio || 1;
    canvasElement.width = 950 * dpr;
    canvasElement.height = 2350 * dpr;
    const ctx = canvasElement.getContext('2d');
    ctx.scale(dpr, dpr);
    try {
        // Cargar imágenes
        const images = store.photos.map(loadImage);
        await Promise.all(images.map(img => img.decode()));
        // Cargar frame
        let frame = null;
        const frameSrc = store.selectedFrame?.src;
        if(frameSrc){
            frame = loadImage(frameSrc.startsWith('/') ? frameSrc : `/${frameSrc}`);
            await frame.decode();
        }
        // Dibujar la tira
        await drawStrip(ctx, images, frame);
        store.photoStrip = canvasElement.toDataURL('image/png');
        stripGenerated.value = true;
    } catch (error) {
        errorMsg.value = true;
        console.error('Error generating photo strip:', error);
    }
};

// Genera la tira si hay 3 fotos
onMounted(async () => {
    if(store.photos.length !== 3) {
        router.push({ name: 'photo-booth' });
    } else {
        await nextTick();
        await generateStrip();
    }
});

// Descarga la tira generada
const downloadStrip = () => {
    if(!store.photoStrip) return;
    const link = document.createElement('a');
    link.href = store.photoStrip;
    link.download = 'photo-strip.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Limpia las fotos y vuelve a la cámara
const repeatPhotos = () => {
    store.clearPhotos();
    router.push({ name: 'photo-booth' });
};
</script>

<template>
<div class="photo-strip-content">
    <div class="view-header">
        <h1>{{ $t('photo-strip.title') }}</h1>
        <p>{{ $t('photo-strip.description') }}</p>
    </div>

    <div v-if="errorMsg" class="error-container">
        <error-content :message="t('photo-strip.error.message')">
            <pv-button class="pv-button primary" :label="$t('photo-strip.button-repeat')" @click="repeatPhotos"></pv-button>
        </error-content>
    </div>

    <div class="canvas-wrapper" v-else-if="store.photos.length === 3">
        <canvas class="photo-strip-canvas" ref="canvas"></canvas>
    </div>
    
    <div class="action-buttons" v-if="!errorMsg">
        <pv-button
        :label="$t('photo-strip.button-download')"
        class="pv-button primary"
        @click="downloadStrip" 
        :disabled="!stripGenerated"></pv-button>
        <pv-button
        :label="$t('photo-strip.button-repeat')"
        class="pv-button secondary"
        @click="repeatPhotos"></pv-button>
    </div>
</div>
</template>

<style scoped>
.photo-strip-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: clamp(24px, 3vw, 32px);
}
.photo-strip-canvas {
    background: #FFFFFF;
    border: #FFFFFF solid;
    width: 100%;
    height: auto;
}
.canvas-wrapper {
    display: flex;
    justify-content: center;
    width: clamp(200px, 50vw, 400px);
    margin: 0 auto;
}
</style>