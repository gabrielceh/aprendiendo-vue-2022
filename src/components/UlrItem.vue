<template>
    <div>
      <p>document id: {{document.id}}</p>
      <p>name: {{document.name}}</p>
      <p>short: {{document.short}}</p>
      <p>user id: {{document.user}}</p>
      <button @click="handleDelete(document.id)" title="Eliminar">❌</button>
      <button @click="router.push(`/edit/${document.id}`)" title="Editar">📝</button>
      <hr>
    </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  import {useRouter} from 'vue-router'

  import { useDatabaseStore } from '../stores/database';

  const databaseStore = useDatabaseStore()
  const router = useRouter()

  const props = defineProps({
    document: Object
  })

  const handleDelete = (id) => {
    databaseStore.deleteUrl(id)
  }
</script>
