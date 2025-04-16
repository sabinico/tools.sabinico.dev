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
  <v-card class="mx-auto" max-width="400">
    <v-toolbar color="blue">
      <v-toolbar-title>Lista de objetivos</v-toolbar-title>
      <v-dialog max-width="500">
        <template #activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" icon="mdi-plus" variant="text" />
        </template>

        <template #default="{ isActive }">
          <v-card title="Añadir nuevo objetivo">
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newTitle"
                      hint="Por ejemplo, llegar a la habitación 46"
                      label="Titulo"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newSubtitle"
                      hint="Información adicional para la tarea"
                      label="Subtitulo"
                      variant="outlined"
                    />
                  </v-col>

                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="red"
                text="Cancelar"
                @click="isActive.value = false"
              />
              <v-spacer />
              <v-btn
                color="green"
                text="Guardar"
                @click="saveNewTask(isActive)"
              />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

    </v-toolbar>

    <v-list
      v-model:selected="tasksPendingSelection"
      lines="three"
      select-strategy="leaf"
    >
      <v-list-subheader>Pendiente</v-list-subheader>
      <v-list-item
        v-for="item in pendingTasks"
        :key="item.title"
        :subtitle="item.subtitle"
        :title="item.title"
        :value="item.title"
        @click="taskSelectionUpdated(item.title, item.completed)"
      >
        <template #prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn disabled :model-value="isSelected" />
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
    <template v-if="pendingTasks.length === 0">
      <v-list lines="one">
        <v-list-item>
          <v-list-item-title>No hay tareas pendientes</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
    <v-divider />
    <v-list
      v-model:selected="tasksCompletedSelection"
      lines="three"
      select-strategy="leaf"
    >
      <v-list-subheader>Completado</v-list-subheader>
      <v-list-item
        v-for="item in completedTasks"
        :key="item.title"
        :subtitle="item.subtitle"
        :title="item.title"
        :value="item.title"
        @click="taskSelectionUpdated(item.title, item.completed)"
      >
        <template #prepend="{ isSelected }">
          <v-list-item-action start>
            <v-checkbox-btn disabled :model-value="isSelected" />
          </v-list-item-action>
        </template>
        <template #title>
          <v-list-item-title class="text-decoration-line-through">{{ item.title }}</v-list-item-title>
        </template>
        <template #subtitle>
          <v-list-item-subtitle class="text-decoration-line-through">{{ item.subtitle }}</v-list-item-subtitle>
        </template>
        <template #append>
          <v-btn
            color="red"
            icon="mdi-close"
            variant="text"
            @click="deleteTask(item.title)"
          />
        </template>
      </v-list-item>
    </v-list>
    <template v-if="completedTasks.length === 0">
      <v-list lines="one">
        <v-list-item>
          <v-list-item-title>No hay tareas completadas</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>

  </v-card>
</template>
<script setup>
  import { computed, onMounted, ref } from 'vue';
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
      title: 'Objetivos pendientes',
      disabled: false,
      href: '/blue-prince/tasks',
    },
  ]
  const store = useBluePrinceStore()
  const tasksPendingSelection = ref([])
  const tasksCompletedSelection = ref([])
  const newTitle = ref('')
  const newSubtitle = ref('')

  // Hooks
  onMounted(() => {
    // Check store items
    const storedTasks = store.tasks
    // Check localStorage items
    const localTasks = JSON.parse(localStorage.getItem('blueprince-tasks')) ?? []

    // If localStorage not empty, recover tasks
    if(localTasks.length > 0){
      store.tasks = localTasks;
    }

    // Subscribe to sync store and localStore
    store.$subscribe((mutation, state) => {
      localStorage.setItem('blueprince-tasks', JSON.stringify(state.tasks))

      // TODO: Update selection
      updateListSelections()
    })

    // If everything is empty, create default tasks
    if(storedTasks.length === 0 && localTasks.length === 0){
      const defaultTasks = [
        { title: 'Inicia el juego', subtitle: 'Juega por primera vez a Blue Prince', completed: true, date: Math.floor(Date.now() / 1000) },
        { title: 'Llegar a la antecámara', subtitle: 'Abrete paso por la mansión hasta llegar a la antecámara', completed: false, date: Math.floor(Date.now() / 1000) },
        { title: 'Encontrar la habitación 46', subtitle: 'Encuentra la puerta que te lleva hasta la habitación 46', completed: false, date: Math.floor(Date.now() / 1000) },
      ]
      store.tasks = defaultTasks
    }

    updateListSelections()
  })

  // Computeds
  const pendingTasks = computed(() => {
    return store.tasks.filter( t => t.completed == false )
  })
  const completedTasks = computed(() => {
    return store.tasks.filter( t => t.completed == true )
  })

  // Methods
  const updateListSelections = () => {
    tasksPendingSelection.value = []
    tasksCompletedSelection.value = completedTasks.value.map(t => t.title)
  }
  const taskSelectionUpdated = (title, completed) => {
    store.tasks.find(t => t.title == title).completed = !completed
  }
  const deleteTask = title => {
    store.tasks = store.tasks.filter(t => t.title !== title)
  }
  const saveNewTask = isActive => {
    const newTask = {
      title: newTitle.value,
      subtitle: newSubtitle.value,
      completed: false,
      date: Math.floor(Date.now() / 1000),
    }
    store.tasks.push(newTask);
    isActive.value = false
    newTitle.value = ''
    newSubtitle.value = ''
  }

</script>
