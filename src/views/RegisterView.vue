<template>  
  <h1 class="text-center">Registrar</h1>
  <a-row>
    <a-col :xs="{span:24}" :md="{span:18, offset:3}" :lg="{span:12, offset:6}">

      <a-form
        :model="formState"
        name="register-form"
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

        <a-form-item
          label="Confirme su Password"
          name="repassword"
          :rules="[
            {min: 6, message:'La contraseña debe tener minimo 6 caracteres'},
            {whitespace:true},
            {validator: validatePass}
          ]"
            
        >
          <a-input-password
            v-model:value="formState.repassword"
            placeholder="Ingrese su contraseña"
            autocomplete="off"
          />
        </a-form-item>
        
        <a-form-item>
          <a-button v-if="!userStore.loadingUser" html-type="submit" type="primary" :disabled="userStore.loadingUser">
            Registrar
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
  import {useUserStore} from '../stores/user'
  import { message } from 'ant-design-vue';

  const userStore = useUserStore()

  
  const formState = reactive({
    email: '',
    password:'',
    repassword:''
  })

  //  validacion personalizada : https://www.antdv.com/components/form#components-form-demo-custom-validation
  const validatePass = async(_rule, value) => {
    if(value.trim() !== formState.password.trim()){
      return Promise.reject('No coinciden las contraseñas')
    }
    return Promise.resolve() 
  }

  const onFinish = async(values) =>{
    const res = await userStore.registerUser(formState.email, formState.password.trim())
    
    if(!res){
      return  message.warning('Revisa tu bandeja de entrada o spam y verifica el correo')
    }

    switch (res) {
      case 'auth/email-already-in-use':
        message.error('Email ya registrado')
        break;
      
      case 'auth/invalid-email':
        message.error('Email invalido')
        break;

      case 'auth/weak-password':
        message.error('Contraseña debe ser de al menos 6 caracteres')
        break;
    
      default:
        message.error('Error inesperado')
    }
    
  }

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  }

</script>

<style lang="scss" scoped>

</style>