import Vue from 'vue'
import Vuex from 'vuex'
import latest from './modules/latest'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    latest,
  },
  strict: process.env.NODE_ENV !== 'production',
})

export * from './modules/latest'
