<template>
  <v-breadcrumbs :items="breadcrumbs">
    <template #divider>
      <v-icon icon="mdi-chevron-right" />
    </template>
  </v-breadcrumbs>
  <v-file-upload
    v-model="files"
    clearable
    density="compact"
    variant="compact"
    @update:model-value="fileUpdated"
  />
  <div v-if="currentFileContents.length > 0">
    <v-card
      flat
      title="Log Viewer"
    >
      <template #text>
        <v-text-field
          v-model="search"
          hide-details
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          variant="outlined"
        />
      </template>

      <v-data-table
        :items="currentFileContents"
        :search="search"
      />
    </v-card>
  </div>

</template>
<script setup>
  import { ref } from 'vue';

  const breadcrumbs = [
    {
      title: 'Sabinico Tools',
      disabled: false,
      href: '/',
    },
    {
      title: 'Vintage Story',
      disabled: false,
      href: '/vintage-story',
    },
    {
      title: 'Logs Viewer',
      disabled: false,
      href: '/vintage-story/logs-viewer',
    },
  ]
  const logTypes = ['audit', 'build', 'chat', 'debug', 'main', 'worldgen']
  const files = ref([])
  const search = ref('')
  const currentFileContents = ref([])

  const regexes = {

    click: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) (left clicked|right clicked|shift clicked) slot (\d+) in ([^\.]+)\. Before: \((.+?)\), after: \((.+?)\)\.?$/i,

    movedTo: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) shift clicked slot (\d+) in ([^\.]+)\. Moved ([^\.]+) to \(([^)]+)\)\.?$/i,

    shiftClickEmpty: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) shift clicked slot (\d+) in ([^\.]+)\. Moved ([^ ]+) to \(([^)]*)\)\.?$/i,

    movedFromTo: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) moved ([^ ]+) from ([^ ]+) to ([^\.]+)\.?$/i,

    putInto: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) Put ([^ ]+) into ([^\.]+)\.?$/i,

    tookFrom: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) Took ([^ ]+) from ([^\.]+)\.?$/i,

    joined: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) joined\.?$/i,

    disconnected: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (?:Client )?(\w+) disconnected\.?$/i,

    death: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) murió\. Mensaje de muerte: (.+)\.?$/i,

    teleport: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] Teleporting player (\w+) from ([^ ]+) to ([^\.]+)\.?$/i,

    killedEntity: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] Player (\w+) killed ([^ ]+) at ([^\.]+)\.?$/i,

    teleportVerbose: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] Teleporting player (\w+) from ([\d\s,]+) to x=([\d.]+), y=([\d.]+), z=([\d.]+)$/i,

    damage: /^(\d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}:\d{2}) \[([^\]]+)] (\w+) at ([\d\s,]+) got ([\d\/.]+) damage (\w+) ([\w:-]+) by (\w+)$/i,

  };

  const fileUpdated = () => {
    if(files.value.length > 0){
      const reader = new FileReader()

      reader.onload = () => {
        const lines = reader.result.replace(/\r/g, '').split('\n');
        currentFileContents.value = []
        lines.forEach(line => {
          const parsedLine = parseLogLine(line);
          currentFileContents.value.push(parsedLine)
        });
      }

      reader.readAsText(files.value[0])
    } else {
      currentFileContents.value = []
    }

  }

  const parseLogLine = line => {
    for (const [type, regex] of Object.entries(regexes)) {
      const match = line.match(regex);
      if (match) {
        switch (type) {
          case 'click':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              accion: match[4],
              slot: match[5],
              contenedor: match[6],
              estadoBefore: match[7],
              estadoAfter: match[8],
              raw: line,
            };
          case 'movedTo':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              slot: match[4],
              contenedor: match[5],
              cantidad: match[6],
              destino: match[7],
              raw: line,
            };
          case 'movedFromTo':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              cantidad: match[4],
              origen: match[5],
              destino: match[6],
              raw: line,
            };
          case 'putInto':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              item: match[4],
              contenedor: match[5],
              raw: line,
            };
          case 'tookFrom':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              item: match[4],
              contenedor: match[5],
              raw: line,
            };
          case 'joined':
          case 'disconnected':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              raw: line,
            };
          case 'death':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              mensajeMuerte: match[4],
              raw: line,
            };
          case 'teleport':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              desde: match[4],
              hasta: match[5],
              raw: line,
            };
          case 'shiftClickEmpty':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              slot: match[4],
              contenedor: match[5],
              cantidad: match[6],
              destino: match[7],
              raw: line,
            };

          case 'killedEntity':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              entidad: match[4],
              posicion: match[5],
              raw: line,
            };

          case 'teleportVerbose':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              desde: match[4],
              x: match[5],
              y: match[6],
              z: match[7],
              raw: line,
            };

          case 'damage':
            return {
              type,
              fechaHora: match[1],
              logType: match[2],
              usuario: match[3],
              posicion: match[4],
              cantidad: match[5],
              tipo: match[6],
              fuente: match[7],
              causadoPor: match[8],
              raw: line,
            };

        }
      }
    }
    return {
      type: 'unknown',
      fechaHora: '',
      logType: '',
      usuario: '',
      raw: line,
    };
  }

</script>
