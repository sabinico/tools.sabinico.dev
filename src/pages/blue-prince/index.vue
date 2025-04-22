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


      <v-row class="mb-8">
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
        <v-col v-for="link in links" :key="link.href" cols="12" sm="6">
          <v-card
            class="py-4"
            color="surface-variant"
            :icon="link.icon"
            :image="link.unlock ? (store.unlockedTools.includes(link.unlock) ? link.image : null) : link.image"
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
  import { useHead } from '@unhead/vue'

  import imgCardBlueKey from '../../assets/games/blue_prince/blue_prince-bluekey-card.png';
  import imgCardJournal from '../../assets/games/blue_prince/blue_prince-journal-card.png';
  import imgCardSteps from '../../assets/games/blue_prince/blue_prince-steps-card.png';
  import imgCardBilliard from '../../assets/games/blue_prince/blue_prince-billiard-card.png';
  import imgCardShrine from '../../assets/games/blue_prince/blue_prince-shrine-card.png';
  import imgCardStudy from '../../assets/games/blue_prince/blue_prince-study-card.png';
  import imgCardRedEnvelope from '../../assets/games/blue_prince/blue_prince-redenvelope-card.png';

  const store = useBluePrinceStore()

  useHead({
    title: 'Blue Prince',
    meta: [
      { name: 'description', content: 'Herramientas y utilidades para jugadores de Blue Prince, desde cuadernos donde realizar anotaciones de pistas, listas para organizar tus objetivos o herramientas para resolución de puzzles automatizados' },
    ],
  })

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
      image: imgCardSteps,
    },
    {
      href: '/blue-prince/journal-notes',
      subtitle: 'Para escribir y guardar tus notas',
      title: 'Diario de notas',
      image: imgCardJournal,
    },
    {
      href: '/blue-prince/billiard-room',
      subtitle: 'Resuelve el puzzle con explicaciones',
      title: 'Puzzle de dardos',
      unlock: 'room_billiard',
      image: imgCardBilliard,
    },
    {
      href: '/blue-prince/shrine',
      subtitle: 'Listado de beneficios del shrine',
      title: 'Ofrendas Santas',
      unlock: 'room_shrine',
      image: imgCardShrine,
    },
    {
      href: '/blue-prince/study-message',
      subtitle: 'Descubre el mensaje secreto',
      title: 'Mensaje de 44 letras',
      unlock: 'room_paintings',
      image: imgCardStudy,
    },
    {
      href: '/blue-prince/safes-codes',
      subtitle: 'Códigos de las cajas fuertes',
      title: 'Cajas Fuertes',
      unlock: 'red_envelopes_safes',
      image: imgCardRedEnvelope,
    },

  ]
</script>
