import Vue from 'vue'
import Vuex from 'vuex'
import larger from './modules/larger'
import latest from './modules/latest'
import random from './modules/random'
import popular from './modules/popular'
import category from './modules/category'
import tag from './modules/tag'
import collection from './modules/collection'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    larger,
    latest,
    random,
    popular,
    category,
    tag,
    collection,
  },
  strict: process.env.NODE_ENV !== 'production',
})
