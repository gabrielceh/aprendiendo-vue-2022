<script setup>
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { useDatabaseStore } from '../stores/database';

  const databaseStore = useDatabaseStore()

  const formState = reactive({
    url:''
  })

  const onFinish = async(values) => {
    const res =  await databaseStore.addUrl(formState.url)
    if(!res){
      formState.url = ''
      return message.success('Url agregada 🤗');
    }

    res && message.error(res)
  }

</script>

<template>
  <a-form
    :model="formState"
    name="add-form"
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
      <a-button 
        html-type="submit" 
        type="primary"
        :loading="databaseStore.loading"
        :disabled="databaseStore.loading"
      >
        Agregar
      </a-button>
    </a-form-item>
  </a-form>
</template>


