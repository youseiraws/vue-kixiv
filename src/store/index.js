import Vue from 'vue'
import Vuex from 'vuex'
import largerPost from './modules/largerPost'
import latest from './modules/latest'
import random from './modules/random'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    largerPost,
    latest,
    random,
  },
  strict: process.env.NODE_ENV !== 'production',
})
