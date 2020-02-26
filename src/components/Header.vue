<template>
  <div>
    <v-navigation-drawer v-model="primaryDrawer.model" :temporary="true" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Meetings</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          link
          :to="item.to"
          @click.prevent="item.click"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="primaryDrawer.model = !primaryDrawer.model" />
      <v-toolbar-title>{{ page_title }}</v-toolbar-title>
    </v-app-bar>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Header',
  data() {
    return {
      page_title: '',
      items: [],
      primaryDrawer: {
        model: null
      }
    }
  },
  computed: {
    ...mapGetters(['getUser', 'getRequestParams', ])
  },
  watch: {
    $route(to, from) {
      this.updatePageTitle(to.path)
    },
  },
  mounted(){
    const path = this.$route.path
    this.updatePageTitle(path)
    this.items = [
      { title: 'Calendario', icon: 'mdi-calendar', to: '/', click: () => false },
      { title: 'Relatorio', icon: 'mdi-clipboard-text', to: '/relatorio', click: () => false },
      { title: 'Gerenciar Salas', icon: 'mdi-border-all', to: '/salas', click: () => false },
      { title: 'Sair', icon: 'mdi-logout', to:false, click: this.actionUserLogout }
    ]
    this.updatePageTitle(path)
  },
  methods: {
    ...mapActions(['actionUserLogout' ]),
    updatePageTitle(path) {
      try {
        this.page_title = this.items.find(item => item.to == path).title
      } catch(ex) {
        this.page_title = ''
      }
    }
  },
}
</script>