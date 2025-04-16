<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template #divider>
      <v-icon icon="mdi-chevron-right" />
    </template>
    <template #item="{ item }">
      <v-breadcrumbs-item
        class="text-subtitle-2 crumb-item"
        :disabled="item.disabled"
        :to="item.href"
      >
        {{ item.title }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
  <v-container class="fill-height" max-width="900">
    <div>
      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1"><a class="text-white text-decoration-none" href="/">Sabinico Tools</a></div>
        <h1 class="text-h2 font-weight-bold">Vintage Story</h1>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
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
  const breadcrumbs = [
    {
      title: 'Sabinico Tools',
      disabled: false,
      href: '/',
    },
    {
      title: 'Vintage Story',
      disabled: false,
      href: '/vintage-story',
    },
  ]
  const links = [
    {
      href: '/vintage-story/logs-viewer',
      subtitle: 'Visualizador de archivos de logs de Vintage Story',
      title: 'Logs Viewer',
    },
  ]
</script>
