import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import vueresource from 'vue-resource';
import DaySpanVuetify from 'dayspan-vuetify'

Vue.config.productionTip = false

Vue.use(vueresource);

Vue.use(vuetify);

Vue.use(DaySpanVuetify, {
  methods: {
    getDefaultEventColor: () => '#1976d2'
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
