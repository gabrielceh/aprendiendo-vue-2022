<template>
  <h1 class="text-center">Perfil</h1>
  <div class="text-center mb-1">
    <p>
      {{userStore.userData.displayName}}
    </p>
    <a-avatar
      :src="userStore.userData.photoURL" 
      :size="100"
    />
  </div>
   <a-row>
    <a-col :xs="{span:24}" :md="{span:18, offset:3}" :lg="{span:12, offset:6}">

      <a-form
        :model="userStore.userData"
        name="profile-form"
        autocomplete="off"
        layout="vertical"
        style="width: 100%; box-shadow:1px 1px 5px #ccc; padding: 1.5rem"
        @finish="onFinish"
      >
        <a-form-item
          name="email"
          label="Tu email (no se puede modificar)"
          :rules="[
            {required: true, message:'Ingresa un email'},
            {type:'email', message:'No es un email valido'},
            {whitespace:true},
          ]"
            
        >
          <a-input 
            v-model:value="userStore.userData.email" 
            type="email" 
            disabled
            placeholder="Ingrese su email"
          />
        </a-form-item>

        <a-form-item
          name="displayName"
          label="Nickname"
          :rules="[
            {required: true, message:'Ingresa un nick'},
            {whitespace:true, message:'Ingresa un nick válido'},
          ]"
            
        >
          <a-input 
            v-model:value="userStore.userData.displayName" 
            placeholder="ex: Gael"
          />
        </a-form-item>

        <a-form-item>
          <a-upload
            v-model:file-list="fileList"
            :before-upload="beforeUpload"
            list-type="picture"
            :max-count="1"
            @change="handleChange"
            @remove="handleRemove"
          >
            <a-button>
              Subir imagen
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item>
          <a-button v-if="!userStore.loadingUser" html-type="submit" type="primary" :disabled="userStore.loadingUser">
            Actualizar informacion
          </a-button>
          <a-space v-else style="width: 100%">
            <a-button type="primary" loading>Loading</a-button>
          </a-space>
        </a-form-item>

      </a-form>

    </a-col>
  </a-row>
</template>

<script setup>
  import { message } from 'ant-design-vue';
  import { onMounted, reactive, ref } from 'vue';
  import {useUserStore} from '../stores/user'

  const userStore = useUserStore()

  const fileList = ref([])

  const onFinish = async(values) =>{
    // console.log(fileList.value[0])

    if(fileList.value[0]){
      const res = await userStore.updateImage(fileList.value[0])
      if(res){
        return message.error('Problemas al actualizar la imagen')
      }
      message.success('Se actualizó tu foto de perfil')
      fileList.value = []
    }

    const res= await userStore.updateUser(values.displayName)
    if(res){
      return message.error('Problemas al actualizar la imagen')
    }
    message.success('Se actualizó tu nombre de usuario')

  }

  const handleChange = ({file,fileList}) => {
      if (file.status !== 'uploading') {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('Solo se acepta png o jpg');
          handleRemove(file)
          return
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('El tamaño de la imagen debe ser menor a 2mb');
          handleRemove(file)
          return
        }
        return isJpgOrPng && isLt2M;
      }
    };

  const handleRemove = file => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  };

  const beforeUpload = (file) => {
    // console.log(file);
    fileList.value = [...fileList.value, file]
    return false;
  }

</script>

<style scoped>
  .mb-1{
    margin-bottom: 1rem;
  }
</style>