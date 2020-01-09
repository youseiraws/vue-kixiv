import Vue from 'vue'
import VuejsClipper from 'vuejs-clipper'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(VuejsClipper)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
