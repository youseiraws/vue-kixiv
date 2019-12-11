import Vue from 'vue'
import Vuex from 'vuex'
import largerPost from './modules/largerPost'
import latest from './modules/latest'
import random from './modules/random'
import category from './modules/category'
import tag from './modules/tag'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    largerPost,
    latest,
    random,
    category,
    tag,
  },
  strict: process.env.NODE_ENV !== 'production',
})
