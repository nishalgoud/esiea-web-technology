<script setup>
import imageLogo from '@/assets/images/umich-logo.jpg'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from '@/stores/auth';
import AuthService from '@/services/AuthService'

const router = useRouter();
const imageLogoImg = ref(imageLogo)

const navigate = (routePath) => {
  router.push(`/${routePath}`)
}

const auth = useAuthStore()

onMounted(() => {
  if (AuthService.isLoggedIn()) {
    auth.setIsLoggedIn(true)
    router.push(`/`)
  }
})
</script>

<template>
  <v-app-bar color="#00274c">
    <v-img width="30" height="70" max-width="100" :src="imageLogoImg"></v-img>
    <v-btn variant="text" color="white" @click="navigate('')"> Esiea Web Technology </v-btn>
    <v-btn variant="text" v-if="!auth.isLoggedIn" color="white" @click="navigate('login')"> Login </v-btn>
    <v-btn variant="text" color="white" @click="navigate('register')"> Register </v-btn>
  </v-app-bar>
</template>
