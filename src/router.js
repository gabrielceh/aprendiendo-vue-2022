import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './stores/user';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import EditView from './views/EditView.vue';
import Profile from './views/Profile.vue';

// Funcion para proteger la ruta home
const requiereAutenticacion = async (to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSesion = true;
  const user = await userStore.currentUser();
  if (user && user.emailVerified) {
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
  if (!user || !user?.emailVerified) {
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
    name: 'home',
  },
  {
    path: '/login',
    component: LoginView,
    // beforeEnter: noRequiereAutenticacion,
    name: 'login',
  },
  {
    path: '/register',
    component: RegisterView,
    // beforeEnter: noRequiereAutenticacion,
    name: 'register',
  },
  {
    path: '/edit/:id',
    component: EditView,
    beforeEnter: requiereAutenticacion,
    name: 'edit',
  },
  {
    path: '/profile',
    component: Profile,
    beforeEnter: requiereAutenticacion,
    name: 'profile',
  },
];

const router = createRouter({
  routes,
  // CreateWebHistory nos sirve para que no aparezca # en las rutas
  history: createWebHistory(),
});

// lo importaremos en el main.js
export default router;
