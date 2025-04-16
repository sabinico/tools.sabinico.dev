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
      <v-col cols="4">
        <v-card class="mx-auto" max-width="400">
          <v-toolbar color="purple">
            <v-toolbar-title>Diario de notas</v-toolbar-title>
            <JournalNoteFormDialog mode="create" />
          </v-toolbar>

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
      <v-col v-if="noteSelection.length > 0" cols="8">
        <template v-if="selectedNote.type == 'note'">
          <v-sheet
            class="d-flex flex-column flex-wrap mx-auto px-4"
            elevation="4"
            height="250"
          >
            <h2 class="text-h4 font-weight-black mt-4">{{ selectedNote.title }}</h2>
            <p class="text-body-2 mt-4" v-html="selectedNote.details.replaceAll('\n','<br />')" />
          </v-sheet>
        </template>
        <template v-if="selectedNote.type == 'postit'">
          <v-sheet
            class="d-flex flex-column align-center justify-center flex-wrap text-center mx-auto px-4"
            :color="selectedNote.color"
            elevation="4"
            height="250"
          >
            <h2 class="text-h4 font-weight-black">{{ selectedNote.title }}</h2>
            <p class="text-body-2 mt-4" v-html="selectedNote.details.replaceAll('\n','<br />')" />
          </v-sheet>
        </template>
        <div class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4 mt-8">
          <JournalNoteFormDialog mode="edit" :note="selectedNote" />
          <v-btn color="red" variant="text" @click="deleteNote">ELIMINAR NOTA</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-spacer />
        <v-alert text="En futuras versiones queremos añadir etiquetas (tags) para ordenar, agrupar y clasificar las notas, un buscador de notas, filtros y la opción para borrar una nota" title="ROADMAP" type="info" />
      </v-col>
    </v-row>
  </v-container>

</template>
<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useBluePrinceStore } from '@/stores/blue-prince';
  import JournalNoteFormDialog from '@/components/blue-prince/JournalNoteFormDialog.vue';

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
  const journalNotes = computed(() => {
    return store.journalNotes.filter( t => t.type == 'note' )
  })
  const journalPostits = computed(() => {
    return store.journalNotes.filter( t => t.type == 'postit' )
  })
  const selectedNote = computed(() => {
    return store.journalNotes.find( t => t.id == noteSelection.value[0] )
  })

  // Methods
  const deleteNote = () => {
    listNotes.value.select(null)
    listPostits.value.select(null)
  }

</script>
