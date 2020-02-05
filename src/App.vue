<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon />
      <v-toolbar-title>
        Meetings
        &nbsp;|&nbsp;
        Usuário
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <Calendario />
    </v-content>
  </v-app>
</template>

<script>
import Calendario from './components/Calendario'

export default {
  name: 'App',

  components: {
    Calendario
  },

  data: () => ({
    //
  })
}
</script>
