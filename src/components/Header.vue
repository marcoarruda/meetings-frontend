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
          <!-- <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon> -->
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
export default {
  data() {
    return {
      page_title: '',
      items: [],
      primaryDrawer: {
        model: null
      }
    }
  },
  watch: {
    $route(to, from) {
      this.updatePageTitle(to.path)
    },
  },
  mounted(){
    const path = this.$route.path
    this.items = [
      { title: 'Relatorio', to: '/relatorio', click: () => false },
      { title: 'Calendario', to: '/', click: () => false },
      { title: 'Sair', icon: 'mdi-logout', to: '/logout', click: () => false }
    ]
    this.updatePageTitle(path)
  },
  methods: {
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