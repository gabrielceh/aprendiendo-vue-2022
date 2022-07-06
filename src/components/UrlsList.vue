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

  import { ref } from 'vue';
  import { useDatabaseStore } from '../stores/database';

  import UlrItem from './UlrItem.vue';

  const databaseStore = useDatabaseStore()
  
  const vwWidth = ref(window.innerWidth)

  window.addEventListener('resize', e => {
    vwWidth.value = window.innerWidth
    console.log(vwWidth.value);
  })

</script>
