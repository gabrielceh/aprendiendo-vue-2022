<template>
  <div>
    <h1>Editar</h1>
    <p v-if="databaseStore.loadingDocs">Loading...</p>
    <a-form
      v-else
      :model="formState"
      name="edit-form"
      autocomplete="off"
      layout="vertical"
      @finish="onFinish"
    >
      <a-form-item
        label="URL:"
        name="url"
        :rules="[
          {required: true, message:'Ingresa una url'},
          {pattern:/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/, message:'No es una url valida'},
          {whitespace:true},
        ]"
      >
        <a-input
          v-model:value="formState.url"
          placeholder="ex: https://mi-web.com"
          type="url"
        >
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-space>
          <a-button 
            html-type="submit" 
            type="primary"
            :loading="databaseStore.loading"
            :disabled="databaseStore.loading"
          >
            Editar
          </a-button>
          
          <a-button 
            type="secondary"
            @click="router.push('/')"
          >
            Volver
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
  import { onMounted, reactive} from 'vue';
  import {useRoute} from 'vue-router'
  import router from '../router'

  import{useDatabaseStore} from '../stores/database'
  import { message } from 'ant-design-vue';

  const route = useRoute()
  const databaseStore = useDatabaseStore()
  // console.log(route.params.id);
  const formState = reactive({
    url:''
  })

  const onFinish = async() => {
    const res = await databaseStore.editUrl(route.params.id, formState.url)
    if(!res){
      return message.success('Editado con exito 😎')
    }

    message.error(res)
  }

  onMounted(async ()=>{
     formState.url = await databaseStore.readUrl(route.params.id)
  })

</script>
