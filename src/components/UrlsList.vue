<template>
  <div>
    <UlrItem 
      v-for="item of databaseStore.documents" 
      :key="item.id" 
      :document="item"
    />
  </div>
</template>

<script setup>

  import { useDatabaseStore } from '../stores/database';

  import UlrItem from './UlrItem.vue';

  const databaseStore = useDatabaseStore()

</script>
