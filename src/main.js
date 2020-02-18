import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vueresource from 'vue-resource'

import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

const awsconfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_qToVlCku5',
    userPoolWebClientId: 'q3ntk8mcvu2p4ma8qm0sqgji7'
  }
}
Amplify.configure(awsconfig)
Vue.use(AmplifyPlugin, AmplifyModules)

Vue.config.productionTip = false

Vue.use(vueresource)

Vue.http.options.root = 'https://9hes83by2l.execute-api.us-east-1.amazonaws.com/dev'
Vue.http.headers.common['Content-Type'] = 'application/json'
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', store.getters.getRequestParams.headers.Authorization)
  next()
})

Vue.use(vuetify)

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.'
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null
    vm = null
    trace = null
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
