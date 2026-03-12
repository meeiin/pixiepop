import { createApp } from 'vue'
import App from './App.vue';
import i18n from "./i18n.js";
import Material from '@primeuix/themes/material';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import {
    Button,
    SelectButton} from 'primevue';
import router from "./router.js";
import pinia from "./pinia.js";
import './assets/css/buttons.css';
import './assets/css/main.css';

createApp(App)
    .use(i18n)
    .use(PrimeVue, {theme: { preset: Material}, ripple: false})
    .component('pv-button', Button)
    .component('pv-select-button', SelectButton)
    .use(router)
    .use(pinia)
    .mount('#app')