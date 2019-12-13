import Vue from 'vue'
import Vuex from 'vuex'
import larger from './modules/larger'
import latest from './modules/latest'
import random from './modules/random'
import category from './modules/category'
import tag from './modules/tag'
import popular from './modules/popular'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    larger,
    latest,
    random,
    category,
    tag,
    popular,
  },
  strict: process.env.NODE_ENV !== 'production',
})
