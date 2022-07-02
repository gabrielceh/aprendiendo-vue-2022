<template>
  <div>
    <h1>
      App base
    </h1>
    <nav
      v-if="!userStore.loadingSesion"
    >
      <router-link 
        to="/"
        v-if="userStore.userData"
      >
        Home |
      </router-link> 
      <router-link 
        v-if="!userStore.userData"
        to="/login"
      >
        Login |
      </router-link>
      <router-link 
        v-if="!userStore.userData"
        to="/register"
      >
        Register |
      </router-link>
      <button
        v-if="userStore.userData"
        @click="userStore.logoutUser"
      >
        Logout
      </button>
    </nav>
    <div
      v-else
    >
      Loading...
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
  import { useUserStore} from './stores/user'

  const userStore = useUserStore()

</script>

<style lang="scss" scoped>

</style>
