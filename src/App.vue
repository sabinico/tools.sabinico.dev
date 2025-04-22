<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  import { useHead } from '@unhead/vue'
  useHead({
    title: 'Home',
    titleTemplate: '%s | Sabinico Tools',
    meta: [
      { name: 'og:site_name', content: 'Sabinico Tools' },
      { name: 'description', content: 'Herramientas y utilidades para jugadores y server admins de distintos juegos como Vintage Story o Blue Prince' },
    ],
  })
</script>
