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
  contain: (state, getters) => getters.settings['CONTAIN'],
  rating: (state, getters) => getters.settings['RATING'],
  carouselsInterval: (state, getters) => getters.settings['CAROUSELS_INTERVAL'],
  pageSize: (state, getters) => getters.settings['PAGE_SIZE'],
  isLoading: state => state.isLoading,
}

const mutations = {
  [SET_SETTINGS]: (state, settings) => (state.settings = settings),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
}

const actions = {
  [UPDATE]: async ({ commit }, { name, value }) => {
    if (_.isEmpty(name) || _.isEmpty(value)) return
    let result
    try {
      result = await api.get(`${baseUrl}/update`, {
        name,
        value,
      })
    } catch {
      result = await api.get(`${baseUrl}/update`, {
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
      result = await api.get(`${baseUrl}/list`)
    } catch {
      result = await api.get(`${baseUrl}/list`)
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
