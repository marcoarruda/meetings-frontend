<template>
  <v-app>
    <appHeader />
    <v-content>
      <v-container>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Header from './components/Header'
export default {
  name: 'App',

  components: {
    appHeader: Header
  },

  data: () => ({
    //
  })
}
</script>
