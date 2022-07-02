<template>
  <div>
    <h1>Editar</h1>
    <p v-if="databaseStore.loadingDocs">Loading...</p>
    <form @submit.prevent="handleSubmit" v-else>
      <input type="text" placeholder="Ingrese una URL" v-model="url">
      <button type="submit">Editar</button>
    </form>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import {useRoute} from 'vue-router'

  import{useDatabaseStore} from '../stores/database'

  const route = useRoute()
  const databaseStore = useDatabaseStore()
  // console.log(route.params.id);
  const url = ref('')

  const handleSubmit = () => {
    databaseStore.editUrl(route.params.id, url.value)
  }

  onMounted(async ()=>{
     url.value = await databaseStore.readUrl(route.params.id)
  })

</script>
