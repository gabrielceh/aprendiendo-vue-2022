<template>
  <a-layout class="layout">
    <a-layout-header  v-if="!userStore.loadingSesion">
      <a-menu
        v-model:selectedKeys="current" 
        :style="{ lineHeight: '64px' }"
        theme="dark"
        mode="horizontal"
      >
        <a-menu-item key="home" v-if="userStore.userData">
          <router-link to="/" >
            Home
          </router-link> 
        </a-menu-item>
        <a-menu-item key="login" v-if="!userStore.userData">
          <router-link to="/login">
            Login
          </router-link>
        </a-menu-item>
        <a-menu-item key="register" v-if="!userStore.userData">
          <router-link to="/register">
            Register
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="userStore.userData" @click="userStore.logoutUser">
            Logout
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 50px;">
      <div class="container">
        <div v-if="userStore.loadingSesion">
          Loading...
        </div>
        <router-view></router-view>
      </div>
    
    </a-layout-content>
  </a-layout>

</template>

<script setup>
  import { ref, watch } from 'vue';
  import {useRoute} from 'vue-router'
  import { useUserStore} from './stores/user'

  const current = ref([])

  const userStore = useUserStore()
  const route = useRoute()

  // console.log(route.name);

  //esta pendiente de un dato reactivo, parecido al useEffect
  watch(
    // Este es el dato que va a vigilat
    () => route.name,
    // Accion a ejecutar
    () => current.value =[route.name]
  )

</script>

<style>
  .container{
    background-color: #fff;
    padding: 24px;
    min-height: calc(100vh - 64px);
  }

  .text-center{
    text-align: center;
  }

</style>
