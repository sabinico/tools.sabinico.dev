<template>
  <v-dialog max-width="500">
    <template #activator="{ props: activatorProps }">
      <v-btn v-if="mode == 'create'" v-bind="activatorProps" icon="mdi-plus" variant="text" />
      <v-btn v-if="mode == 'edit'" v-bind="activatorProps" variant="text">EDITAR NOTA</v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card :title="`${mode == 'create' ? 'Añadir nueva' : 'Editar'} nota`">
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="newNote.type"
                  hide-details
                  item-title="label"
                  item-value="value"
                  :items="typesNote"
                  label="Tipo"
                  variant="outlined"
                />
              </v-col>
              <v-col v-if="newNote.type === 'postit'" cols="12">
                <v-btn-toggle v-model="newNote.color" class="w-100" mandatory>
                  <v-btn
                    v-for="color in colorsPostit"
                    :key="color.color"
                    :color="color.color"
                    :label="color.label"
                    :value="color.color"
                  >
                    <div>{{ color.label }}</div>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newNote.title"
                  hint="Por ejemplo, llegar a la habitación 46"
                  label="Titulo"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="newNote.details"
                  auto-grow
                  hide-details
                  label="Detalles"
                  rows="2"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="newNote.tags"
                  chips
                  clearable
                  hint="Puedes crear tus propias etiquetas escribiendolas y pulsando enter"
                  :items="currentTags"
                  label="Tags"
                  multiple
                  variant="outlined"
                />
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            v-if="mode == 'create'"
            color="red"
            text="Cancelar"
            @click="isActive.value = false"
          />
          <v-spacer />
          <v-btn
            color="green"
            text="Guardar"
            @click="saveNote(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script setup>
  import { computed, onBeforeUpdate, ref } from 'vue';
  import { useBluePrinceStore } from '@/stores/blue-prince';

  // Props
  const props = defineProps({
    note: {
      type: Object,
      required: false,
      default: null,
    },
    mode: {
      type: String,
      required: true,
    },
  })

  // Data
  const store = useBluePrinceStore()
  const typesNote = [
    {
      label: 'Anotación',
      value: 'note',
    },
    {
      label: 'Post-it',
      value: 'postit',
    },
  ]
  const colorsPostit = [
    {
      label: 'Blanco',
      color: 'white',
    },
    {
      label: 'Azul',
      color: 'blue',
    },
    {
      label: 'Rojo',
      color: 'red',
    },
    {
      label: 'Verde',
      color: 'green',
    },
  ]
  const newNote = ref({
    id: props.mode === 'edit' ? props.note.id : Date.now(),
    type: props.mode === 'edit' ? props.note.type : 'note',
    color: props.mode === 'edit' ? props.note.color : 'white',
    title: props.mode === 'edit' ? props.note.title : '',
    details: props.mode === 'edit' ? props.note.details : '',
    tags: props.mode === 'edit' ? props.note.tags : [],
  })

  // Hooks
  onBeforeUpdate(() => {

    if(props.mode === 'edit'){
      newNote.value = props.note
    }

  })

  // Computed
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
  const saveNote = isActive => {
    const note = {
      id: newNote.value.id,
      type: newNote.value.type,
      color: newNote.value.color,
      title: newNote.value.title,
      details: newNote.value.details,
      tags: newNote.value.tags,
      date: Math.floor(Date.now() / 1000),
    }

    if(props.mode === 'edit'){
      const otherNotes = store.journalNotes.filter(n => n.id != props.note.id)
      otherNotes.push(note)
      store.journalNotes = otherNotes
      isActive.value = false
    } else {
      store.journalNotes.push(note)
      isActive.value = false
      newNote.value.id = Date.now()
      newNote.value.type = 'note'
      newNote.value.color = 'white'
      newNote.value.title = ''
      newNote.value.details = ''
      newNote.value.tags = []
    }

  }

</script>
