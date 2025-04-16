<template>
  <v-container class="fill-height" max-width="900">
    <div>
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      />

      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">Sabinico Tools</h1>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            rounded="lg"
            variant="tonal"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">
                ¿Qué es esto?
              </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Herramientas y utilidades para administradores de game-servers, jugadores y desarrolladores
              </div>
            </template>
          </v-card>
        </v-col>

        <v-col v-for="link in links" :key="link.href" cols="6">
          <v-card
            class="py-4"
            color="surface-variant"
            :image="link.icon"
            rounded="lg"
            :subtitle="link.subtitle"
            :title="link.title"
            :to="link.href"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
  import logovintage from '../assets/games/vintage_story-card.png';
  import logoBluePrince from '../assets/games/blue_prince/blue_prince-card.png';
  const links = [
    {
      href: '/vintage-story',
      icon: logovintage,
      subtitle: 'Utilidades para administradores',
      title: 'Vintage Story',
    },
    {
      href: '/blue-prince',
      icon: logoBluePrince,
      subtitle: 'Cuaderno de notas para jugadores',
      title: 'Blue Prince',
    },
  ]
</script>
