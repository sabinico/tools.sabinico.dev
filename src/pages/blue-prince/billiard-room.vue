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
        <div class="mb-8">
          <h1 class="text-h2 text-center font-weight-bold mb-2">Billiard Room Puzzle</h1>
          <h2 v-if="solve != 0" :class="`text-h5 text-center font-weight-bold mb-2 ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].includes(solve) ? 'text-green' : 'text-red'}`">Solution: {{ solve }}</h2>
          <v-alert
            density="compact"
            text="Esta herramienta está en desarrollo y no esta completamente finalizada, es posible que encuentres fallos o errores al utilizarla, notificalos al desarrollador para solucionarlos lo antes posible"
            title="Herramienta en desarrollo"
            type="warning"
          />
        </div>
      </v-col>
      <v-col
        cols="12"
        md="6"
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
            <v-btn color="blue" @click="addModifier">ADD MODIIFIER</v-btn>
            <v-btn
              v-if="modifiers.length > 0"
              class="ml-4"
              color="red"
              variant="text"
              @click="removeModifier"
            >REMOVE LAST MODIFIER</v-btn>
          </div>

          <h3 class="text-subtitle-2 font-weight-black my-2 text-blue">Segments</h3>
          <v-row v-if="segments.length > 0" class="mb-8 w-100">
            <template v-for="(segment, key) in segments" :key="key">
              <v-col cols="3">
                <v-select
                  v-model="segment.ring"
                  hide-details
                  item-title="label"
                  item-value="value"
                  :items="rings"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="segment.number"
                  hide-details
                  :items="[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="segment.color"
                  hide-details
                  item-title="label"
                  item-value="color"
                  :items="colors"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="segment.isPartialFilled"
                  hide-details
                  item-title="label"
                  item-value="value"
                  :items="filledType"
                />
              </v-col>
            </template>
          </v-row>
          <div class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4 mb-4">
            <v-btn color="blue" @click="addSegment">ADD SEGMENT</v-btn>
            <v-btn
              v-if="segments.length > 0"
              class="ml-4"
              color="red"
              variant="text"
              @click="removeSegment"
            >REMOVE LAST SEGMENT</v-btn>
          </div>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="2" />
      <v-col cols="12" md="4">
        <SvgDartboard class="w-100" :modifiers="modifiers" :segments="segments" :solution="solve" />
      </v-col>

    </v-row>
  </v-container>

</template>
<script setup>
  import { useHead } from '@unhead/vue'
  import { computed, onMounted, ref } from 'vue';
  import { useBluePrinceStore } from '@/stores/blue-prince';
  import SvgDartboard from '@/components/blue-prince/SvgDartboard.vue';

  useHead({
    title: 'Billiar Room | Blue Prince',
    meta: [
      { name: 'description', content: 'Herramienta para solucionar el puzzle de la diana de dardos de la sala del billar en el juego Blue Prince' },
    ],
  })

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
  const rings = [
    {
      label: 'Primer anillo',
      value: 1,
    },
    {
      label: 'Segundo anillo',
      value: 2,
    },
    {
      label: 'Tercer anillo',
      value: 3,
    },
    {
      label: 'Cuarto anillo',
      value: 4,
    },
  ]
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
      label: 'Casilla llena',
      value: false,
    },
    {
      label: 'Pintado un tercio',
      value: true,
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
    {
      type: 'round-1',
      label: '2 lineas onduladas',
      operation: 'round-1',
    },
    {
      type: 'round-10',
      label: '4 lineas onduladas',
      operation: 'round-10',
    },
    {
      type: 'round-100',
      label: '6 lineas onduladas',
      operation: 'round-100',
    },
  ]
  const modifiers = ref([])
  const segments = ref([])
  const store = useBluePrinceStore()

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
  const solve = computed(() => {
    if(segments.value.length == 0) return 0
    return solvePuzzle(segments.value, modifiers.value)
  })


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
  const addSegment = () => {
    segments.value.push({
      ring: 1,
      number: 1, // opcional, aplica a operaciones de este color
      color: 'blue', // 'square', 'reverse', 'repeat', etc.
      isPartialFilled: false, // 'square', 'reverse', 'repeat', etc.
    })
  }
  const removeSegment = () => {
    segments.value.pop()
  }
  const getSegmentValue = seg => {
    return seg.isPartialFilled ? seg.number / 3 : seg.number
  }

  const getOperation = color => {
    switch (color) {
      case 'blue': return (a, b) => a + b
      case 'yellow': return (a, b) => a - b
      case 'pink': return (a, b) => a * b
      case 'purple': return (a, b) => a / b
    }
  }

  const applyModifiers = (value, segment, modifiers) => {
    for (const mod of modifiers) {
      if (mod.position === 'center' && mod.color === segment.color) {
        switch (mod.type) {
          case 'square': value = Math.pow(value, 2); break
          case 'diamond': {
            const reversed = String(Math.abs(Math.floor(value))).split('').reverse().join('')
            value = parseInt(reversed) * (value < 0 ? -1 : 1)
            break
          }
          case 'round-1': value = Math.round(value); break
          case 'round-10': value = Math.round(value / 10) * 10; break
          case 'round-100': value = Math.round(value / 100) * 100; break
        }
      }
    }
    return value
  }

  const applyFinalModifiers = (value, modifiers) => {
    for (const mod of modifiers) {
      if (mod.position === 'border') {
        switch (mod.type) {
          case 'half': value = value / 2; break
          case 'round-1': value = Math.round(value); break
          case 'round-10': value = Math.round(value / 10) * 10; break
          case 'round-100': value = Math.round(value / 100) * 100; break
        }
      }
    }
    return value
  }
  const solvePuzzle = (segments, modifiers) => {
    if (segments.length === 0) return 0

    console.log('Solving...')
    // Ordenar del anillo más interno al más externo
    const ordered = [...segments].sort((a, b) => a.ring - b.ring)

    // Evaluar el primer valor (se debe ajustar si es amarillo)
    const first = ordered[0]
    let acc = getSegmentValue(first)
    if (first.color === 'yellow') {
      acc = -acc // si es resta, se empieza desde el negativo
    }
    console.log('Init value: ' + acc)

    acc = applyModifiers(acc, first, modifiers)
    console.log('After modifier value: ' + acc)

    // Recorrer los siguientes segmentos
    for (let i = 1; i < ordered.length; i++) {
      const seg = ordered[i]
      const value = getSegmentValue(seg)
      const op = getOperation(seg.color)
      acc = op(acc, value)
      acc = applyModifiers(acc, seg, modifiers)
      console.log('Next value: ' + acc)
    }

    // Aplicar modificadores de tipo 'border'
    acc = applyFinalModifiers(acc, modifiers)
    console.log('Final value: ' + acc)

    return acc
  }


</script>
