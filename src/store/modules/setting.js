import _ from 'lodash'
import api from '../../api'

const baseUrl = '/setting'

/** mutations-types **/
const SET_SETTINGS = 'SET_SETTINGS'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'

/** actions-types **/
const UPDATE = 'UPDATE'
const LIST = 'LIST'

const state = {
  settings: [],
  isLoading: false,
}

const getters = {
  settings: state => {
    const result = {}
    state.settings.forEach(setting => (result[setting.name] = setting.value))
    return result
  },
  contain: (state, getters) => getters.settings['CONTAIN'] || false,
  rating: (state, getters) => getters.settings['RATING'] || ['s', 'q', 'e'],
  carouselsInterval: (state, getters) =>
    getters.settings['CAROUSELS_INTERVAL'] || 6,
  pageSize: (state, getters) => getters.settings['PAGE_SIZE'] || 100,
  isLoading: state => state.isLoading,
}

const mutations = {
  [SET_SETTINGS]: (state, settings) => (state.settings = settings),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
}

const actions = {
  [UPDATE]: async ({ commit }, { name, value }) => {
    let result
    try {
      result = await api.post(`${baseUrl}/update`, {
        name,
        value,
      })
    } catch {
      result = await api.post(`${baseUrl}/update`, {
        name,
        value,
      })
    }
    if (!_.isEmpty(result)) commit(SET_SETTINGS, result)
  },
  [LIST]: async ({ state, commit }) => {
    if (state.isLoading) return
    commit(START_LOADING)
    let result
    try {
      result = await api.post(`${baseUrl}/list`)
    } catch {
      result = await api.post(`${baseUrl}/list`)
    }
    if (!_.isEmpty(result)) commit(SET_SETTINGS, result)
    commit(FINISH_LOADING)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
