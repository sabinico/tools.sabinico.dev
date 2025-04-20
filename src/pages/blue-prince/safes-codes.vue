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
          <h1 class="text-h2 font-weight-bold mb-2">Códigos Cajas Fuertes</h1>
          <v-dialog max-width="500">
            <template #activator="{ props: activatorProps }">
              <v-btn v-bind="activatorProps" color="red" variant="text">INTRODUCIR CÓDIGO</v-btn>
            </template>
            <template #default="{ isActive }">
              <v-card subtitle="Ingresa la misma ofrenda que que realices en el juego" title="Realiza una ofrenda">
                <v-card-text>
                  <v-form>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="newCode"
                          clearable
                          :label="`Introduce el código`"
                          :rules="[rules.maxLength(4)]"
                          variant="outlined"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    class="mb-4"
                    color="red"
                    text="COMPROBAR CÓDIGO"
                    @click="saveCode(isActive)"
                  />
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </div>
      </v-col>
      <template v-for="safe in validCodes" :key="safe.envelope">
        <v-col
          v-if="store.redenvelopes.includes(safe.code)"
          cols="12"
          md="6"
          xl="3"
        >
          <v-sheet
            class="d-flex flex-column align-center justify-center flex-wrap text-center mx-auto px-4 position-relative"
            elevation="4"
            min-height="200"
          >
            <h2 class="text-h4 font-weight-black mb-2 text-red">{{ safe.code }}</h2>
            <h3 class="text-subtitle-1 font-weight-black">{{ safe.room }}</h3>
            <h4 class="text-subtitle-2 font-weight-black text-red">RED ENVELOPE #{{ safe.envelope }}</h4>
            <div v-if="safe.gems > 0" class="d-flex align-center justify-center flex-wrap text-center position-absolute top-0 right-0 mr-4 mt-4">
              <span style="color: #f8afd3">+{{ safe.gems }}</span><v-img :src="iconGem" width="20" />
            </div>
          </v-sheet>
        </v-col>
      </template>

    </v-row>
  </v-container>

</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import { useRules } from 'vuetify/labs/rules'
  import { useBluePrinceStore } from '@/stores/blue-prince';

  import iconGem from '@/assets/games/blue_prince/blue_prince-gem-icon.png'


  // Data
  const newCode = ref(null);
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
      title: 'Cajas fuertes',
      disabled: false,
      href: '/blue-prince/safes-codes',
    },
  ]
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
  const saveCode = isActive => {
    if(newCode.value && newCode.value.length == 4){
      // Check valid code

      // Transform code
      const code = newCode.value.toUpperCase()
      // Save
      if(!store.redenvelopes.includes(code)){
        store.redenvelopes.push(code)
      }
      isActive.value = false
    }

  }

</script>
