import {createRouter, createWebHistory} from 'vue-router';
import Home from './shared/presentation/views/home.vue';
import PhotoBoothCamema from './proyect/presentation/views/photo-booth-camera.vue';
import PhotoStripView from './proyect/presentation/views/photo-strip-view.vue';
import SelectFrame from './proyect/presentation/views/select-frame.vue';
import { useProjectStore } from './proyect/application/project.store';

const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const routes = [
    { path: '/home', name: 'home', component: Home, meta: { title: 'view.home' } },
    { path: '/photo-booth', name: 'photo-booth', component: PhotoBoothCamema, meta: { title: 'view.photo-booth', requiresFrame: true}},
    { path: '/photo-strip', name: 'photo-strip', component: PhotoStripView, meta: { title: 'view.photo-strip', requiresFrame: true}},
    { path: '/select-frame', name: 'select-frame', component: SelectFrame, meta: { title: 'view.select-frame' } },
    { path: '/:pathMatch(.*)*', name: 'page-not-found', component: pageNotFound, meta: { title: 'view.page-not-found' } },
    { path: '/', redirect: { name: 'home'}}
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to) => {
    const store = useProjectStore();
    if(to.meta.requiresFrame && !store.selectedFrame){
        return{ name: 'select-frame' };
    }
});

export default router;