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
    <v-row>
      <v-col cols="12">
        <div class="mb-8 text-center">
          <h1 class="text-h2 font-weight-bold">Mensaje de 44 letras</h1>
          <h2 v-if="secretMessageEncrypted == currentMessageEncrypted" class="text-h6 font-weight-bold mt-4 text-green">{{ secretmessage }}</h2>
        </div>
      </v-col>
      <v-col cols="12">
        <div v-for="rank in ranks" :key="`rank-${rank}`" class="d-flex align-center justify-center flex-wrap text-center mx-auto mb-2">
          <v-hover v-for="column in columns" :key="`rank-${rank}-column-${column}`">
            <template #default="{ isHovering, props }">
              <v-sheet
                border="lg dashed surface-bright"
                class="mr-2 d-flex align-center justify-center text-h3 cursor-pointer"
                :color="isHovering ? 'blue-darken-1' : 'blue-darken-3'"
                height="60"
                width="60"
                v-bind="props"
                @click="openBox(column + rank)"
              >
                <span :class="secretMessageEncrypted == currentMessageEncrypted ? 'text-green' : 'text-white'">{{ store.paintings[column + rank] ?? '' }}</span>
              </v-sheet>
            </template>
          </v-hover>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
        text="¿Has dado con la letra de esta casilla? Escribela o déjalo en blanco para borrar"
        :title="`Casilla ${selectedBox}`"
      >
        <v-card-text>
          <v-text-field
            v-model="valueBox"
            clearable
            :label="`Casilla ${selectedBox}`"
            :rules="[rules.maxLength(1)]"
            variant="outlined"
          />
        </v-card-text>
        <template #actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="saveBox()"
          />
        </template>
      </v-card>
    </v-dialog>
  </v-container>

</template>
<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useRules } from 'vuetify/labs/rules'
  import { useBluePrinceStore } from '@/stores/blue-prince';

  // Data
  const secretmessage = 'If we count small gates, eight dates crack eight safes';
  const ranks = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const columns = ['A', 'B', 'C', 'D', 'E'];
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
      title: 'Mensaje de 44 letras',
      disabled: false,
      href: '/blue-prince/study-message',
    },
  ]
  const dialog = ref(false)
  const selectedBox = ref(null)
  const valueBox = ref(null)
  const rules = useRules()
  const store = useBluePrinceStore()

  // Hooks
  onMounted(() => {

    // Check localStorage
    const local = JSON.parse(localStorage.getItem('blueprince-paintings')) ?? {}

    // If localStorage not empty, recover
    store.paintings = local;

    // Subscribe to sync store and localStore
    store.$subscribe((mutation, state) => {
      localStorage.setItem('blueprince-paintings', JSON.stringify(state.paintings))
    })

  })

  // Computeds
  const secretMessageEncrypted = computed(() => {
    return secretmessage.toUpperCase().replaceAll(' ','').replaceAll(',','')
  })
  const currentMessageEncrypted = computed(() => {
    let message = ''
    ranks.forEach(rank => {
      columns.forEach(col => {
        message += store.paintings[col + rank] ?? ''
      });
    });
    return message
  })

  // Methods
  const openBox = key => {
    dialog.value = true;
    selectedBox.value = key;
    valueBox.value = store.paintings[key] ?? null
  }

  const saveBox = () => {
    if(valueBox.value == null || valueBox.value.length < 2){
      store.paintings[selectedBox.value] = valueBox.value == null ? '' : valueBox.value.toUpperCase()
      dialog.value = false;
    }
  }

</script>
