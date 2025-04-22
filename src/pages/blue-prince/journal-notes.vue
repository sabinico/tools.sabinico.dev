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
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mx-auto">
          <v-toolbar color="purple">
            <v-toolbar-title>Diario de notas</v-toolbar-title>
            <v-btn icon="mdi-magnify" variant="text" @click="toggleSearch" />
            <v-btn icon="mdi-filter" variant="text" @click="toggleFilters" />
            <JournalNoteFormDialog mode="create" />
          </v-toolbar>
          <v-expand-transition>
            <v-toolbar v-show="expandSearch" color="purple">
              <v-text-field
                v-model="searchParams"
                class="mx-4"
                hide-details
                label="Buscar notas"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
              />
            </v-toolbar>
          </v-expand-transition>
          <v-expand-transition>
            <v-toolbar v-show="expandFilters" color="purple">

              <v-autocomplete
                v-model="searchFilters"
                chips
                class="mx-4"
                clearable
                hide-details
                :items="currentTags"
                label="Filtrar por tags"
                multiple
                prepend-inner-icon="mdi-tag"
                variant="outlined"
              />
            </v-toolbar>
          </v-expand-transition>


          <v-list
            ref="listNotes"
            v-model:selected="noteSelection"
            lines="one"
            select-strategy="single-leaf"
          >
            <v-list-subheader>Anotaciones</v-list-subheader>
            <v-list-item
              v-for="item in journalNotes"
              :key="item.title"
              :title="item.title"
              :value="item.id"
            />
          </v-list>
          <template v-if="journalNotes.length === 0">
            <v-list lines="one">
              <v-list-item>
                <v-list-item-title>No hay anotaciones creadas</v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
          <v-divider />
          <v-list
            ref="listPostits"
            v-model:selected="noteSelection"
            lines="one"
            select-strategy="single-leaf"
          >
            <v-list-subheader>Post-it</v-list-subheader>
            <v-list-item
              v-for="item in journalPostits"
              :key="item.title"
              :title="item.title"
              :value="item.id"
            />
          </v-list>
          <template v-if="journalPostits.length === 0">
            <v-list lines="one">
              <v-list-item>
                <v-list-item-title>No hay post-it creados</v-list-item-title>
              </v-list-item>
            </v-list>
          </template>

        </v-card>
      </v-col>
      <v-col v-if="noteSelection.length > 0" cols="12" md="8">
        <template v-if="selectedNote.type == 'note'">
          <v-sheet
            class="d-flex flex-column flex-wrap mx-auto px-4"
            elevation="4"
            min-height="250"
          >
            <h2 class="text-h4 font-weight-black mt-4 w-100">{{ selectedNote.title }}</h2>
            <p class="text-body-2 mt-4" v-html="selectedNote.details.replaceAll('\n','<br />')" />
          </v-sheet>
        </template>
        <template v-if="selectedNote.type == 'postit'">
          <v-sheet
            class="d-flex flex-column align-center justify-center flex-wrap text-center mx-auto px-4"
            :color="selectedNote.color"
            elevation="4"
            min-height="250"
          >
            <h2 class="text-h4 font-weight-black w-100">{{ selectedNote.title }}</h2>
            <p class="text-body-2 mt-4" v-html="selectedNote.details.replaceAll('\n','<br />')" />
          </v-sheet>
        </template>
        <div class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4 mt-8">
          <JournalNoteFormDialog mode="edit" :note="selectedNote" />
          <v-btn color="red" variant="text" @click="deleteNote">ELIMINAR NOTA</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>

</template>
<script setup>
  import { useHead } from '@unhead/vue'
  import { computed, onMounted, ref } from 'vue';
  import { useBluePrinceStore } from '@/stores/blue-prince';
  import JournalNoteFormDialog from '@/components/blue-prince/JournalNoteFormDialog.vue';

  useHead({
    title: 'Journal Notes | Blue Prince',
    meta: [
      { name: 'description', content: 'Herramienta para tomar apuntes de pistas y post-its que encuentres en el juego, te permite organizarlos y clasificarlos con etiquetas' },
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
      title: 'Diario de notas',
      disabled: false,
      href: '/blue-prince/journal-notes',
    },
  ]
  const store = useBluePrinceStore()
  const listNotes = ref(null)
  const listPostits = ref(null)
  const noteSelection = ref([])
  const expandSearch = ref(false)
  const searchParams = ref(null)
  const expandFilters = ref(false)
  const searchFilters = ref([])

  // Hooks
  onMounted(() => {

    // Check localStorage items
    const localNotes = JSON.parse(localStorage.getItem('blueprince-journalnotes')) ?? []

    // If localStorage not empty, recover notes
    if(localNotes.length > 0){
      store.journalNotes = localNotes;
    }

    // Subscribe to sync store and localStore
    store.$subscribe((mutation, state) => {
      localStorage.setItem('blueprince-journalnotes', JSON.stringify(state.journalNotes))
    })

  })

  // Computeds
  const filteredJournal = computed(() => {
    let all = store.journalNotes
    if(searchParams.value){
      all = all.filter( t => t.title.toLowerCase().includes(searchParams.value.toLowerCase()) || t.details.toLowerCase().includes(searchParams.value.toLowerCase()) )
    }
    if(searchFilters.value){
      searchFilters.value.forEach(filter => {
        all = all.filter( t => t.tags.includes(filter))
      });
    }
    return all
  })
  const journalNotes = computed(() => {
    return filteredJournal.value.filter( t => t.type == 'note' )
  })
  const journalPostits = computed(() => {
    return filteredJournal.value.filter( t => t.type == 'postit' )
  })
  const selectedNote = computed(() => {
    return store.journalNotes.find( t => t.id == noteSelection.value[0] )
  })
  const currentTags = computed(() => {
    const tags = [];
    store.journalNotes.forEach(note => {
      note.tags.forEach(tag => {
        if(!tags.includes(tag)){
          tags.push(tag)
        }
      });
    });
    return tags
  })

  // Methods
  const deleteNote = () => {
    const id = noteSelection.value[0]
    listNotes.value.select(null)
    listPostits.value.select(null)
    store.journalNotes = store.journalNotes.filter( t => t.id != id)
  }
  const toggleSearch = () => {
    expandSearch.value = !expandSearch.value
  }
  const toggleFilters = () => {
    expandFilters.value = !expandFilters.value
  }

</script>
