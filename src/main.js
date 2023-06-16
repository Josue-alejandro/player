import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import BottomPlayer from './components/BottomPlayer.vue'

// Crea el enrutador
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/ruta1', component: BottomPlayer, props: { playerMode: 0 } },
    { path: '/ruta2', component: BottomPlayer, props: { playerMode: 1 } },
    { path: '/ruta3', component: BottomPlayer, props: { playerMode: 2 } }
  ]
})

// Crea la aplicación y monta el enrutador
const app = createApp(App)
app.use(router)
app.mount('#app')