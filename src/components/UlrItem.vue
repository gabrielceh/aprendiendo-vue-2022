<template>
  <a-space direction="vertical" style="width:100%">
      <a-card 
        :title="document.short"
      >
        <template #extra>
          <a-space>
            <a-popconfirm
              title="¿Desea eliminar este elemento?"
              ok-text="Eliminar"
              cancel-text="Cancelar"
              @confirm="handleDelete(document.id)"
              @cancel="handleCancel"
            >
              <a-button 
                title="Eliminar"
                danger
                :loading="databaseStore.loading"
              >Eliminar</a-button>
            </a-popconfirm>
            
            <a-button 
              @click="router.push(`/edit/${document.id}`)" 
              title="Editar"
            >Editar</a-button>
          </a-space>
        </template>
        <p>Url: {{document.name}}</p>
      </a-card>
  </a-space>
</template>

<script setup>
  import { defineProps} from 'vue';
  import {useRouter} from 'vue-router'

  import { useDatabaseStore } from '../stores/database';

  import { message } from 'ant-design-vue';

  const databaseStore = useDatabaseStore()
  const router = useRouter()

  const props = defineProps({
    document: Object
  })
  

  const handleDelete = async(id) => {
    const res = await databaseStore.deleteUrl(id)
    if(!res){
      message.success('Elemento eliminado con exito')
    }

    message.error(res)

  }

  const handleCancel = () => {
    message.info('Accion cancelada')
  }
</script>

<style scope>
  .truncate{
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
