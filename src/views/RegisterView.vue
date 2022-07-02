<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <input
        v-model.trim="email"
        type="email" 
        placeholder="Ingrese su email"
      >
      <input 
        v-model.trim="password"
        type="password" 
        placeholder="Ingrese su contraseña"
        autocomplete="false"
      >
      <button type="submit">Crear usuario</button>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import {useUserStore} from '../stores/user'

  const userStore = useUserStore()

  
  const email = ref('')
  const password = ref('')

  const handleSubmit = async() =>{
    if(!email.value || !password.value){
      return alert('Campos requeridos')
    }
    if(password.value.length < 6){
      return alert('La contraseña debe tener al menos 6 caracteres')
    }
    console.log(email.value, password.value);
    await userStore.registerUser(email.value, password.value)
  }

</script>

<style lang="scss" scoped>

</style>