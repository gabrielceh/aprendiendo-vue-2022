import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { createPinia } from 'pinia';

// https://www.antdv.com/docs/vue/getting-started#Import-on-Demand
import 'ant-design-vue/es/message/style/css';

createApp(App).use(router).use(createPinia()).mount('#app');
