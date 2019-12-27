import _ from 'lodash'
import api from '../../api'

const baseUrl = '/collection'

/** mutations-types **/
const SET_COLLECTIONS = 'SET_COLLECTIONS'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'

/** actions-types **/
const ADD = 'ADD'
const REMOVE = 'REMOVE'
const COLLECTIONS = 'COLLECTIONS'
const LIKE = 'LIKE'
const DISLIKE = 'DISLIKE'
const BLACK = 'BLACK'
const UNBLACK = 'UNBLACK'

const state = {
  collections: [],
  isLoading: false,
}

const getters = {
  collections: state => state.collections,
  isLoading: state => state.isLoading,
}

const mutations = {
  [SET_COLLECTIONS]: (state, collections) => (state.collections = collections),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
}

const actions = {
  [ADD]: async ({ commit }, name) => {
    const result = await api.get(`${baseUrl}/add`, { name })
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [REMOVE]: async ({ commit }, name) => {
    const result = await api.get(`${baseUrl}/remove`, { name })
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [COLLECTIONS]: async ({ state, commit }) => {
    if (state.isLoading) return
    commit(START_LOADING)
    const result = await api.get(`${baseUrl}/collections`)
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
    commit(FINISH_LOADING)
  },
  [LIKE]: async ({ commit }, { name, id }) => {
    const result = await api.get(`${baseUrl}/like`, { name, id })
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [DISLIKE]: async ({ commit }, { name, id }) => {
    const result = await api.get(`${baseUrl}/dislike`, { name, id })
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [BLACK]: async ({ commit }, { name, id }) => {
    const result = await api.get(`${baseUrl}/black`, { name, id })
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [UNBLACK]: async ({ commit }, { name, id }) => {
    const result = await api.get(`${baseUrl}/unblack`, { name, id })
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
