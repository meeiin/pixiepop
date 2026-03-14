<script setup>
import { computed, onBeforeUnmount, onMounted, ref} from 'vue';
import { useProjectStore } from '../../application/project.store';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
import ErrorContent from '../../../shared/presentation/components/error-content.vue';

const store = useProjectStore();
const router = useRouter();
const video = ref(null);
const countdown = ref(null);
const isCounting = ref(false);
const { t } = useI18n();
const errorCamera = ref(false); // Solo se muestra si falla la cámara
const errorVideo = ref(false);  // Solo se muestra si el video no está listo
const facingMode = ref('user'); // 'user' para cámara frontal, 'environment' para trasera
const isMobile = ref(false);

const checkMultipleCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    isMobile.value = cameras.length > 1;
};

// Layout del marco y slots para las fotos
const frameLayout = {
    width: 950,
    height: 2350,
    slots: [
        { x: 75, y: 100, width: 800, height: 600 },
        { x: 75, y: 775, width: 800, height: 600 },
        { x: 75, y: 1450, width: 800, height: 600 }
    ]
}

// Computed para verificar si hay slots definidos en el frame
const hasSlots = computed(() => store.selectedFrame?.slotOverlays?.length > 0);
const currentSlotIndex = ref(0);
// Computed para obtener el slot activo
const activeSlot = computed(() => {
    if(!hasSlots.value) return null;
    const overlaysLength = store.selectedFrame.slotOverlays.length;
    // Validar límites para evitar errores
    const index = Math.min(Math.max(currentSlotIndex.value, 0), overlaysLength - 1);
    return store.selectedFrame.slotOverlays[index];
});


const stream = ref(null);
const requestCamera = async () => {
    stream.value?.getTracks().forEach(track => track.stop());
    // Solicita acceso a la cámara
    let localStream = null;
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode.value, width: { ideal: 3840 }, height: { ideal: 2160 } } });
        if(video.value){
            video.value.srcObject = localStream;
            errorCamera.value = false;
        }
    } catch (error) {
        errorCamera.value = true;
        console.error('Error accessing camera:', error);
    }
    stream.value = localStream;
};

const toggleCamera = () => {
    facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
    requestCamera();
};

// Captura una foto del video y la almacena en el store
const takePhoto = () => {
    if(!video.value || video.value.readyState < 2){
        // Error: el video no está listo para capturar la foto
        errorVideo.value = true;
        console.error('Video not ready for capturing photo.');
        return;
    }

    errorVideo.value = false; // Asegura que el error de video se oculte si el video está listo

    const captureWidth = video.value.videoWidth;
    const captureHeight = video.value.videoHeight;

    if(captureWidth === 0 || captureHeight === 0){
        console.error('Invalid dimensions for capturing photo.');
        return;
    }

    let slotRatio = captureWidth / captureHeight;

    if(hasSlots.value) {
        const slot = frameLayout.slots[currentSlotIndex.value];
        if(slot && slot.width > 0 && slot.height > 0){
            slotRatio = slot.width / slot.height;
        }
    }

    let sx, sy, sw, sh;

    if(captureWidth / captureHeight > slotRatio) {
        sh = captureHeight
        sw = sh * slotRatio
        sx = (captureWidth - sw) / 2
        sy = 0
    } else {
        sw = captureWidth
        sh = sw / slotRatio
        sx = 0
        sy = (captureHeight - sh) / 2
    }

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.translate(sw, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video.value, sx, sy, sw, sh, 0, 0, sw, sh);
    ctx.restore();
    const dataUrl = canvas.toDataURL('image/png');
    store.addPhoto(dataUrl);

    // Validar que no se exceda el número de slots
    if(currentSlotIndex.value < frameLayout.slots.length - 1){
        currentSlotIndex.value++;
    }

    if(store.photos.length >= 3) {
        router.push({ name: 'photo-strip' });
    }
};

let countdownInterval = null;

// Inicia una cuenta regresiva antes de tomar la foto
const startCountdown = () => {
    if(isCounting.value) return;
    isCounting.value = true;
    countdown.value = 3;
    countdownInterval = setInterval(() => {
        countdown.value--;
        if(countdown.value === 0) {
            clearInterval(countdownInterval);
            countdown.value = null;
            isCounting.value = false;
            takePhoto();
        }
    }, 1000);
};

// Permite al usuario cambiar el marco, limpiando las fotos actuales
const changeFrame = () => {
    if(store.photos.length === 0){
        router.push({ name: 'select-frame' });
        return;
    }
    store.openConfirmCard({
        title: t('photo-booth.confirm.title'),
        description: t('photo-booth.confirm.description'),
        onConfirm: () => {
            store.clearPhotos();
            router.push({ name: 'select-frame' });
        }
    })
};
onMounted(async () => {
    await checkMultipleCameras();
    await requestCamera();
});

// Libera la cámara al desmontar el componente
onBeforeUnmount(() => {
    clearInterval(countdownInterval);
    stream.value?.getTracks().forEach(track => track.stop());
});
</script>

<template>
<div class="photo-booth-content">
    <!-- Header -->
    <div class="view-header">
        <h1>{{ $t('photo-booth.title') }}</h1>
        <p>{{ $t('photo-booth.description') }}</p>
    </div>

    <!-- Estado de error -->
    <div v-if="errorCamera || errorVideo" class="error-visual-content">
        <error-content
            :message="errorCamera ? t('photo-booth.error.camera') : t('photo-booth.error.video')">
            <div class="error-actions">
                <pv-button class="pv-button primary" :label="$t('options.error.button-retry')" @click="requestCamera"></pv-button>
                <pv-button class="pv-button tertiary" :label="$t('photo-booth.button-change')" @click="changeFrame"></pv-button>
            </div>
        </error-content>
    </div>

    <!-- Contenido principal -->
    <template v-else>
        <div class="photo-counter">
            <p>{{ store.photos.length }} {{ $t('photo-booth.counter') }} 3</p>
        </div>
        <div class="camera-preview">
            <video ref="video" autoplay playsinline></video>
            <img 
                v-if="hasSlots" 
                :src="activeSlot"
                class="slot-overlay"
                alt=""/>
            <div v-if="countdown !== null" class="countdown-overlay">
                {{ countdown }}
            </div>
            <pv-button v-if="isMobile" class="toggle-camera-button" icon="pi pi-sync" @click="toggleCamera"></pv-button>
        </div>
        <div class="action-buttons">
            <pv-button :label="t('photo-booth.button-capture')" class="pv-button primary" @click="startCountdown" :disabled="isCounting || store.photos.length >= 3"></pv-button>
            <pv-button :label="t('photo-booth.button-change')" class="pv-button tertiary" @click="changeFrame"></pv-button>
        </div>
    </template>
</div>
</template>

<style scoped>
.photo-booth-content{
    gap: clamp(16px, 2.5vw, 24px);
}
.photo-counter p{
    font-size: clamp(18px, 2.5vw, 30px);
    margin: 0;
    font-weight: bold;
    color: #64748B;
}
.camera-preview {
    aspect-ratio: 800/600;
    overflow: hidden;
    position: relative;
    width: clamp(280px, 80vw, 800px);
}
.camera-preview video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
}
.slot-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    object-fit: cover;
    z-index: 10;
}
.photo-booth-content{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.countdown-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: clamp(48px, 8vw, 96px);
    color: white;
    z-index: 10;
}
.toggle-camera-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #F65AE4;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none !important;
    transition: background 0.2s;
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 20;
}

.toggle-camera-button:hover {
    background: #d94ecb !important;
}

.toggle-camera-button .pi {
    font-size: 20px;
}
</style>