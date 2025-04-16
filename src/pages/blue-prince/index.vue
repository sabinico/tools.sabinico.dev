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
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/games/blue_prince/blue_prince-logo.png"
      />
      <div class="mb-8 text-center">
        <h1 class="text-h2 font-weight-bold">Sabinico Tools</h1>
      </div>


      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            :image="imgCardBlueKey"
            rounded="lg"
            variant="tonal"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">
                Herramientas sin spoilers
              </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                <p>Muchas herramientas se encuentran ocultas para evitar posibles spoilers.</p>
                <p>Puedes desbloquear algunas según avances en el juego usando este botón.</p>
              </div>
            </template>

            <template #actions>
              <UnlockTools />
            </template>
          </v-card>
        </v-col>
        <v-col v-for="link in links" :key="link.href" cols="6">
          <v-card
            class="py-4"
            color="surface-variant"
            :icon="link.icon"
            :image="link.image"
            rounded="lg"
            :subtitle="link.unlock ? (store.unlockedTools.includes(link.unlock) ? link.subtitle : '??? ??????? ??? ?????????') : link.subtitle"
            :title="link.unlock ? (store.unlockedTools.includes(link.unlock) ? link.title : '????????') : link.title"
            :to="link.unlock ? (store.unlockedTools.includes(link.unlock) ? link.href : null) : link.href"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
  import { useBluePrinceStore } from '@/stores/blue-prince';

  import imgCardBlueKey from '../../assets/games/blue_prince/blue_prince-bluekey-card.png';

  const store = useBluePrinceStore()

  const breadcrumbs = [
    {
      title: 'Sabinico Tools',
      disabled: false,
      href: '/',
    },
    {
      title: 'Blue Prince',
      disabled: false,
      href: '/blue-prince',
    },
  ]
  const links = [
    {
      href: '/blue-prince/tasks',
      subtitle: 'Una lista para trackear tus objetivos',
      title: 'Objetivos pendientes',
    },
    {
      href: '/blue-prince/journal-notes',
      subtitle: 'Un diario para escribir y guardar tus anotaciones',
      title: 'Diario de notas',
    },
    {
      href: '/blue-prince',
      subtitle: 'Trackea tu progreso descubriendo las letras secretas',
      title: 'Mensaje de 44 letras',
      unlock: 'room_paintings',
    },

  ]
</script>
