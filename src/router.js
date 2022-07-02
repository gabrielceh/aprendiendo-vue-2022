import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './stores/user';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import EditView from './views/EditView.vue';

// Funcion para proteger la ruta home
const requiereAutenticacion = async (to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSesion = true;
  const user = await userStore.currentUser();
  if (user) {
    next();
  } else {
    next('/login');
  }
  userStore.loadingSesion = false;
};

const noRequiereAutenticacion = async (to, from, next) => {
  const userStore = useUserStore();
  const user = await userStore.currentUser();
  userStore.loadingSesion = true;
  if (user === null) {
    next();
  } else {
    next('/');
  }
  userStore.loadingSesion = false;
};

const routes = [
  {
    path: '/',
    component: HomeView,
    // Ruta protegida
    beforeEnter: requiereAutenticacion,
  },
  {
    path: '/login',
    component: LoginView,
    beforeEnter: noRequiereAutenticacion,
  },
  {
    path: '/register',
    component: RegisterView,
    beforeEnter: noRequiereAutenticacion,
  },
  {
    path: '/edit/:id',
    component: EditView,
    beforeEnter: requiereAutenticacion,
  },
];

const router = createRouter({
  routes,
  // CreateWebHistory nos sirve para que no aparezca # en las rutas
  history: createWebHistory(),
});

// lo importaremos en el main.js
export default router;
