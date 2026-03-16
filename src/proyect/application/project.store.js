import { defineStore } from "pinia";
import { ref } from "vue";

export const useProjectStore = defineStore("project", () => {
    const photos = ref([]);
    const selectedFrame = ref(null);
    const photoStrip = ref(null);
    const showConfirmCard = ref(false); // Estado global para el confirm-card
    const confirmTitle = ref('');
    const confirmDescription = ref('');
    const onConfirmAction = ref(null);
    const captureMode = ref('manual');

    const addPhoto = (photo) => {
        if (photos.value.length < 3){
            photos.value.push(photo);
        }
    }

    const selectFrame = (frame) => {
        selectedFrame.value = frame;
    }

    const clearPhotos = () => {
        photos.value = [];
        photoStrip.value = null;
    }

    const openConfirmCard = ({title, description, onConfirm}) => {
        confirmTitle.value = title;
        confirmDescription.value = description;
        onConfirmAction.value = onConfirm;
        showConfirmCard.value = true;
    }

    const closeConfirmCard = () => {
        showConfirmCard.value = false;
        onConfirmAction.value = null;
    }

    const confirmAction = () => {
        if (onConfirmAction.value) {
            onConfirmAction.value();
        }
        closeConfirmCard();
    }

    return { photos, selectedFrame, photoStrip, showConfirmCard, confirmTitle, confirmDescription, captureMode, addPhoto, clearPhotos, selectFrame, openConfirmCard, closeConfirmCard, confirmAction};
})