import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
<<<<<<< HEAD

const app = createApp(App);
app.use(router);
=======
import store from './store';

const app = createApp(App);
app.use(router);
app.use(store);
>>>>>>> 26cae8b (权限控制)
app.mount('#app');