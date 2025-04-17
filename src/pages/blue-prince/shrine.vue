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
    <div>
      <div class="mb-8 text-center">
        <h1 class="text-h2 font-weight-bold">Shrine blessings</h1>
        <v-dialog max-width="500">
          <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" color="amber" variant="text">HAZ UNA OFRENDA</v-btn>
          </template>
          <template #default="{ isActive }">
            <v-card subtitle="Ingresa la misma ofrenda que que realices en el juego" title="Realiza una ofrenda">
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-number-input
                        v-model="newOffering"
                        color="amber"
                        control-variant="split"
                        hide-details
                        :inset="true"
                        :max="80"
                        :min="0"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  class="mb-4"
                  color="amber"
                  text="REALIZAR OFRENDA"
                  @click="saveOffering(isActive)"
                />
                <v-spacer />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>

      <v-row class="mb-8">
        <v-col
          v-for="blessing in blessings"
          :key="blessing.key"
          cols="12"
          md="6"
          xl="3"
        >
          <v-sheet
            v-if="hasUnlockedShrineBlessing(blessing) || showEverything"
            class="d-flex flex-column align-center justify-center flex-wrap text-center mx-auto px-4"
            elevation="4"
            min-height="320"
          >
            <h3 class="text-subtitle-1 font-weight-black mt-4">Blessing of the</h3>
            <h2 class="text-h4 font-weight-black mb-2" :style="`${blessing.color ? 'color: '+blessing.color+';' : ''}`">{{ blessing.title }}</h2>
            <v-img
              height="100"
              :src="blessing.image"
              width="100"
            />
            <p class="text-body-2 my-4" v-html="blessing.description" />
            <div class="d-flex align-center justify-center flex-wrap text-center mx-auto mb-4">
              <template v-for="i in 5" :key="`blessing-${blessing.key}-${i}`">
                <div v-if="store.shrine.includes(blessing.min + (16 * (i - 1))) || store.shrine.includes((blessing.min + 1) + (16 * (i - 1)))" class="mx-2 d-flex flex-column align-center justify-center flex-wrap text-center ">
                  <span class="text-amber text-body-2 d-flex align-center justify-center">
                    <template v-if="store.shrine.includes(blessing.min + (16 * (i - 1)))">
                      {{ blessing.min + (16 * (i - 1)) }}
                    </template>
                    <template v-if="store.shrine.includes(blessing.min + (16 * (i - 1))) && store.shrine.includes((blessing.min + 1) + (16 * (i - 1)))">
                      -
                    </template>
                    <template v-if="store.shrine.includes((blessing.min + 1) + (16 * (i - 1)))">
                      {{ (blessing.min + 1) + (16 * (i - 1)) }}
                    </template>
                    <v-img
                      class="ml-1"
                      height="16"
                      :src="iconCoins"
                      width="16"
                    />
                  </span>
                  <span class="">
                    <span class="text-body-2 d-flex align-center justify-center">
                      {{ 3 + (i - 1) }}<v-img
                        class="ml-1"
                        height="16"
                        :src="iconTime"
                        width="16"
                      />
                    </span>

                  </span>
                </div>
              </template>
            </div>
          </v-sheet>
          <v-sheet
            v-else
            class="d-flex flex-column align-center justify-center flex-wrap text-center mx-auto px-4"
            elevation="4"
            height="320"
          >
            <h3 class="text-subtitle-1 font-weight-black mt-4">Blessing of the</h3>
            <h2 class="text-h4 font-weight-black mb-2">?????????</h2>
            <v-img
              height="100"
              :src="iconLock"
              width="100"
            />
            <p class="text-body-2 my-4">Haz una ofrenda en el SHRINE para intentar desbloquear esta bendición</p>
            <div v-if="false" class="d-flex align-center justify-center flex-wrap text-center mx-auto mb-4">
              <div v-for="i in 5" :key="`blessing-${blessing.key}-${i}`" class="mx-2 d-flex flex-column align-center justify-center flex-wrap text-center ">
                <span class="text-amber text-body-2 d-flex align-center justify-center">
                  {{ blessing.min + (16 * (i - 1)) }}-{{ (blessing.min + 1) + (16 * (i - 1)) }}
                  <v-img
                    class="ml-1"
                    height="16"
                    :src="iconCoins"
                    width="16"
                  />
                </span>
                <span class="">
                  <span class="text-body-2 d-flex align-center justify-center">
                    {{ 3 + (i - 1) }}<v-img
                      class="ml-1"
                      height="16"
                      :src="iconTime"
                      width="16"
                    />
                  </span>

                </span>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </div>
  </v-container>

</template>
<script setup>
  import { computed, onBeforeMount, onMounted, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useBluePrinceStore } from '@/stores/blue-prince';

  import iconCoins from '@/assets/games/blue_prince/blue_prince-coins-icon.png'
  import iconGem from '@/assets/games/blue_prince/blue_prince-gem-icon.png'
  import iconDice from '@/assets/games/blue_prince/blue_prince-dice-icon.png'
  import iconTime from '@/assets/games/blue_prince/blue_prince-time-icon.png'
  import iconLock from '@/assets/games/blue_prince/blue_prince-lock-icon.png'

  import imgDancer from '@/assets/games/blue_prince/shrine/blessing_dancer.png'
  import imgHighroller from '@/assets/games/blue_prince/shrine/blessing_highroller.png'
  import imgGardener from '@/assets/games/blue_prince/shrine/blessing_gardener.png'
  import imgChef from '@/assets/games/blue_prince/shrine/blessing_chef.png'
  import imgRedgeneral from '@/assets/games/blue_prince/shrine/blessing_redgeneral.png'
  import imgTinkerer from '@/assets/games/blue_prince/shrine/blessing_tinkerer.png'
  import imgMonk from '@/assets/games/blue_prince/shrine/blessing_monk.png'

  // Data
  const showEverything = ref(false);
  const newOffering = ref(0);
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
      title: 'Ofrendas santas',
      disabled: false,
      href: '/blue-prince/shrine',
    },
  ]
  const blessings = [
    {
      key: 'dancer',
      title: 'Dancer',
      description: `While drafting, you may pay gems to spin floor plans, each spin will cost you <span style="color: #dda4e1;">-1</span><img class="ml-1" src="${iconGem}" style="width: 16px; height: 16px; vertical-align: middle;" />`,
      color: '#dda4e1',
      coins: [],
      min: 1,
      image: imgDancer,
    },
    {
      key: 'highroller',
      title: 'High Roller',
      description: `Each time you draft a <span style="color: #f3f39f;">SHOP ROOM</span>, gain +1<img class="ml-1" src="${iconDice}" style="width: 16px; height: 16px; vertical-align: middle;" /><br />Gain +5<img class="ml-1" src="${iconCoins}" style="width: 16px; height: 16px; vertical-align: middle;" /> extra COINS each time you roll a DICE`,
      color: '#8f9239',
      coins: [],
      min: 3,
      image: imgHighroller,
    },
    {
      key: 'gardener',
      title: 'Gardener',
      description: 'Adds 8 <span style="color: #438941;">COURTYARDS</span> to your draft pool',
      color: '#438941',
      coins: [],
      min: 5,
      image: imgGardener,
    },
    {
      key: 'chef',
      title: 'Chef',
      description: 'Foor each different type of <span style="color: #f3f39f;">SPREAD</span> that you do, adds an additional dish to the DINING ROOM',
      color: '#f3f39f',
      coins: [],
      min: 7,
      image: imgChef,
    },
    {
      key: 'redgeneral',
      title: 'Red General',
      description: `Six <span style="color: #d73132;">RED ROOMS</span> on different ranks <span style="color: #dda4e1;">+5</span><img class="ml-1" src="${iconGem}" style="width: 16px; height: 16px; vertical-align: middle;" />`,
      color: '#d73132',
      coins: [],
      min: 9,
      image: imgRedgeneral,
    },
    {
      key: 'tinkerer',
      title: 'Tinkerer',
      description: 'Each time you drafted a new mechanical room triggers your current experiment',
      color: '#2c9088',
      coins: [],
      min: 11,
      image: imgTinkerer,
    },
    {
      key: 'monk',
      title: 'Monk',
      description: 'Call it a day in a room to possibly draft that room from the grounds the following day',
      color: '#6d9cb1',
      coins: [],
      min: 13,
      image: imgMonk,
    },
    {
      key: 'berrypicker',
      title: 'Berry Picker',
      description: 'When drafting, gives the option to instead pick a berry to draw a random floorplan ignoring rarity',
      coins: [],
      min: 15,
      image: null,
    },
  ]
  const store = useBluePrinceStore()
  const { hasUnlockedShrineBlessing } = storeToRefs(store)

  // Hooks
  onBeforeMount(() => {

    // Fill coins data
    fillBlessingsDataWithCoins()

  })

  onMounted(() => {

    // Check localStorage
    const local = JSON.parse(localStorage.getItem('blueprince-shrine')) ?? []

    // If localStorage not empty, recover
    if(local.length > 0){
      store.shrine = local;
    }

    // Subscribe to sync store and localStore
    store.$subscribe((mutation, state) => {
      localStorage.setItem('blueprince-shrine', JSON.stringify(state.shrine))
    })


    // Debug or full access
    if(localStorage.getItem('blueprince-shrine-bypass')){
      showEverything.value = true;
    }

  })

  // Computeds


  // Methods
  const fillBlessingsDataWithCoins = () => {
    blessings.forEach(b => {
      const min = b.min;
      const coins = [];
      for (let i = 0; i < 5; i++) {
        coins.push(min + (16 * i))
        coins.push(min + 1 + (16 * i))
      }
      b.coins = coins;
    });
  }

  const saveOffering = isActive => {
    if(!store.shrine.includes(newOffering.value)){
      store.shrine.push(newOffering.value)
    }
    isActive.value = false
  }

  const testOffering = () => {
    blessings.forEach(b => {
      hasUnlockedShrineBlessing.value(b)
    });

  }

</script>
