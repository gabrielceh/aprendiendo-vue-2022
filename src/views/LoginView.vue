<template>
  <h1 class="text-center">Login</h1>
  <a-row>
    <a-col :xs="{span:24}" :md="{span:18, offset:3}" :lg="{span:12, offset:6}">

      <a-form
        :model="formState"
        name="login-form"
        autocomplete="off"
        layout="vertical"
        style="width: 100%; box-shadow:1px 1px 5px #ccc; padding: 1.5rem"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="email"
          label="Email"
          :rules="[
            {required: true, message:'Ingresa un email'},
            {type:'email', message:'No es un email valido'},
            {whitespace:true},
          ]"
            
        >
          <a-input 
            v-model:value="formState.email" 
            type="email" 
            placeholder="Ingrese su email"
          />
        </a-form-item>
  
        <a-form-item
          label="Password"
          name="password"
          :rules="[
            {required: true, message:'Ingresa tu contraseña'},
            {min: 6, message:'La contraseña debe tener minimo 6 caracteres'},
            {whitespace:true},
          ]"
            
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="Ingrese su contraseña"
            autocomplete="off"
          />
        </a-form-item>
        
        <a-form-item>
          <a-button v-if="!userStore.loadingUser" html-type="submit" type="primary" :disabled="userStore.loadingUser">
            Iniciar sesión
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
  import { reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import {useUserStore} from '../stores/user'
  

  const userStore = useUserStore()

  const formState = reactive({
    email: '',
    password:''
  })
  // const email = ref('')
  // const password = ref('')

  const onFinish = async(values) =>{
    // validaciones : https://www.antdv.com/components/form#Validation-Rules
    console.log(values);
    const res = await userStore.loginUser(formState.email, formState.password)
    // console.log(res);
    if(!res){
      return message.success('Bienvenido 🤗')
    }
    switch (res) {
      case 'auth/user-not-found':
        message.error('Usuario o contraseña no valida')
        break;

      case 'auth/wrong-password':
        message.error('Usuario o contraseña no valida')
        break;

      case 'auth/too-many-requests':
        message.error('Demasiadas peticiones')
        break;

      default:
        message.error('Fallo del servidor')
        break;
    }   
  }

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  }

</script>

<style lang="scss" scoped>

</style>