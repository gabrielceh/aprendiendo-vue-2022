<template>
  <div>
    <h2>Home - {{userStore.userData?.email}}</h2>

    <!-- <form @submit.prevent="handleSubmit">
      <input type="text" placeholder="Ingrese una URL" v-model="url">
      <button type="submit">Agregar</button>
    </form> -->

    <AddForm/>

    <p v-if="databaseStore.loadingDocs">loading...</p>
    <UrlsList v-else/>
  </div>
</template>

<script setup>
  import { onMounted, ref} from 'vue';

  import {useDatabaseStore} from '../stores/database'
  import { useUserStore } from '../stores/user';

  import UrlsList from '../components/UrlsList.vue'
  import AddForm from '../components/AddForm.vue';
  

  document.title = 'Home'

  const userStore = useUserStore()
  const databaseStore = useDatabaseStore()


  const url = ref('')

  // const handleSubmit = () => {
  //   // validar url
  //   databaseStore.addUrl(url.value)
  // }

  onMounted(async()=>{
    await databaseStore.getUrls()

  })



</script>
