import Vue from 'vue'
import Vuex from 'vuex'
import post from './modules/post'
import larger from './modules/larger'
import latest from './modules/latest'
import random from './modules/random'
import popular from './modules/popular'
import category from './modules/category'
import tag from './modules/tag'
import collection from './modules/collection'
import setting from './modules/setting'
import tooltip from './modules/tooltip'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    post,
    larger,
    latest,
    random,
    popular,
    category,
    tag,
    collection,
    setting,
    tooltip,
  },
  strict: process.env.NODE_ENV !== 'production',
})
