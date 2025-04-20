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
  <v-container class="fill-height">


    <v-row class="mb-8">
      <v-col cols="12">
        <div class="mb-8 text-center">
          <h1 class="text-h2 font-weight-bold mb-2">Billiard Room Puzzle</h1>
        </div>
      </v-col>
      <v-col
        cols="6"
      >
        <v-sheet
          class="d-flex flex-column align-center justify-center flex-wrap text-center mx-auto px-4"
          elevation="4"
          min-height="200"
        >
          <h2 class="text-h4 font-weight-black my-2 text-blue">Puzzle Setup</h2>
          <h3 class="text-subtitle-2 font-weight-black mb-2 text-blue">Modifiers</h3>
          <v-row v-if="modifiers.length > 0" class="mb-8 w-100">
            <template v-for="modifier in modifiers" :key="modifier.type">
              <v-col cols="4">
                <v-select v-model="modifier.position" hide-details :items="['center','border']" />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="modifier.color"
                  hide-details
                  item-title="label"
                  item-value="color"
                  :items="colors"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="modifier.type"
                  hide-details
                  item-title="label"
                  item-value="type"
                  :items="modifierTypes"
                />
              </v-col>
            </template>
          </v-row>
          <div class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4">
            <v-btn class="mr-4" color="blue" @click="addModifier">ADD MODIIFIER</v-btn>
            <v-btn v-if="modifiers.length > 0" color="red" variant="text" @click="removeModifier">REMOVE LAST MODIIFIER</v-btn>
          </div>

          <h3 class="text-subtitle-2 font-weight-black my-2 text-blue">Segments</h3>
          <v-btn class="mb-4" color="blue">ADD SEGMENT</v-btn>
        </v-sheet>
      </v-col>

    </v-row>
  </v-container>

</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import { useRules } from 'vuetify/labs/rules'
  import { useBluePrinceStore } from '@/stores/blue-prince';

  // Data
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
    {
      title: 'Puzzle de dardos',
      disabled: false,
      href: '/blue-prince/billiard-room',
    },
  ]
  const stages = ['center-circle', 'first-ring', 'second-ring', 'thrid-ring', 'fourth-ring', 'exterior-ring']
  const colors = [
    {
      label: 'Azul',
      color: 'blue',
      operation: 'sum',
    },
    {
      label: 'Amarillo',
      color: 'yellow',
      operation: 'sub',
    },
    {
      label: 'Rosa',
      color: 'pink',
      operation: 'multiply',
    },
    {
      label: 'Morado',
      color: 'purple',
      operation: 'divide',
    },
  ]
  const filledType = [
    {
      type: 'full-filled',
      operation: 'none',
    },
    {
      type: '1/3-filled',
      operation: 'divide-3',
    },
  ]
  const modifierTypes = [
    {
      type: 'square',
      label: 'Cuadrado',
      operation: 'square',
    },
    {
      type: 'diamond',
      label: 'Diamante',
      operation: 'reverse',
    },
  ]
  const modifiers = ref([])
  const segments = ref([])
  const validCodes = [
    {
      code: 'MAY8',
      envelope: 1,
      room: 'UNDERPASS',
      gems: 0,
    },
    {
      code: '1208',
      envelope: 2,
      room: 'ESTUDIO',
      gems: 1,
    },
    {
      code: '1225',
      envelope: 4,
      room: 'BOUDOIR',
      gems: 1,
    },
    {
      code: '0811',
      envelope: 5,
      room: 'DRAFTING ROOM',
      gems: 0,
    },
    {
      code: '0415',
      envelope: 6,
      room: 'DRAWING ROOM',
      gems: 1,
    },
    {
      code: 'DATE',
      envelope: 7,
      room: 'BUNKER',
      gems: 0,
    },
    {
      code: '0303',
      envelope: 8,
      room: 'OFFICE',
      gems: 1,
    },
  ]
  const store = useBluePrinceStore()
  const rules = useRules()

  // Hooks
  onMounted(() => {

    // Check localStorage
    const local = JSON.parse(localStorage.getItem('blueprince-redenvelopes')) ?? []

    // If localStorage not empty, recover
    if(local.length > 0){
      store.redenvelopes = local;
    }

    // Subscribe to sync store and localStore
    store.$subscribe((mutation, state) => {
      localStorage.setItem('blueprince-redenvelopes', JSON.stringify(state.redenvelopes))
    })

  })

  // Computeds


  // Methods
  const addModifier = () => {
    modifiers.value.push({
      position: 'center', // o 'border'
      color: 'pink', // opcional, aplica a operaciones de este color
      type: 'square', // 'square', 'reverse', 'repeat', etc.
    })
  }
  const removeModifier = () => {
    modifiers.value.pop()
  }

</script>
