<template>

  <v-dialog max-width="800">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="blue-lighten-2">DESBLOQUEAR HERRAMIENTAS</v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card>
        <v-card-item>
          <v-card-title>Desbloquear herramientas</v-card-title>
          <v-card-subtitle>Selecciona las casillas de los estamentos que cumplas para desbloquear las herramientas evitando spoilers</v-card-subtitle>
        </v-card-item>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col v-for="(tool, key) in tools" :key="key" cols="12">
                <v-row align="center">
                  <v-col cols="1">
                    <v-switch
                      v-model="tool.unlocked"
                      color="blue"
                      hide-details
                      inset
                      @update:model-value="value => unlockTool(tool.toolname, value)"
                    />
                  </v-col>
                  <v-col cols="11">
                    <v-card-title>{{ tool.unlocked ? tool.title : '?????????' }}</v-card-title>
                    <v-card-subtitle><span v-html="tool.description" /></v-card-subtitle>
                  </v-col>
                </v-row>

              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Cerrar"
            @click="isActive.value = false"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useBluePrinceStore } from '@/stores/blue-prince';

  const store = useBluePrinceStore()
  const tools = ref({
    room_paintings: {
      title: 'MENSAJE DE 44 LETRAS',
      description: 'Has <b>DESBLOQUEADO</b> y <b>ENTRADO</b> en el <b class="text-blue-darken-1">ESTUDIO</b>',
      toolname: 'room_paintings',
      unlocked: false,
    },
    test1: {
      title: 'TEST 1',
      description: 'Has <b>DESBLOQUEADO</b> y <b>ENTRADO</b> en el <b class="text-blue-darken-1">ESTUDIO</b>',
      toolname: 'test1',
      unlocked: false,
    },
  })

  onMounted(() => {
    const localUnlocked = JSON.parse(localStorage.getItem('blueprince-unlockedtools')) ?? []
    if(localUnlocked.length > 0){
      store.unlockedTools = localUnlocked;
    }
    store.$subscribe((mutation, state) => {
      localStorage.setItem('blueprince-unlockedtools', JSON.stringify(state.unlockedTools))
    })
    store.unlockedTools.forEach(tool => {
      tools.value[tool].unlocked = true;
    });
  })

  const unlockTool = (toolname, newValue) => {
    tools.value[toolname].unlocked = newValue;
    if(newValue && !store.unlockedTools.includes(toolname)){
      store.unlockedTools.push(toolname);
    }
    if(!newValue && store.unlockedTools.includes(toolname)){
      store.unlockedTools = store.unlockedTools.filter(t => t !== toolname);
    }
  }

</script>
