import _ from 'lodash'
import api from '../../api'

const baseUrl = '/collection'

/** mutations-types **/
const SET_COLLECTIONS = 'SET_COLLECTIONS'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'

/** actions-types **/
const ADD = 'ADD'
const EDIT = 'EDIT'
const REMOVE = 'REMOVE'
const LIST = 'LIST'
const LIKE = 'LIKE'
const DISLIKE = 'DISLIKE'
const BLACK = 'BLACK'
const UNBLACK = 'UNBLACK'

const state = {
  collections: [],
  isLoading: false,
}

const getters = {
  collections: state =>
    state.collections.filter(collection => collection.name !== '黑名单'),
  blacklist: state =>
    state.collections.find(collection => collection.name === '黑名单'),
  isLoading: state => state.isLoading,
}

const mutations = {
  [SET_COLLECTIONS]: (state, collections) => (state.collections = collections),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
}

const actions = {
  [ADD]: async ({ commit }, name) => {
    if (_.isEmpty(name)) return
    let result
    try {
      result = await api.get(`${baseUrl}/add`, { name })
    } catch {
      result = await api.get(`${baseUrl}/add`, { name })
    }
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [EDIT]: async ({ commit }, { oldName, newName }) => {
    if (_.isEqual(oldName, newName) || _.isEmpty(newName)) return
    let result
    try {
      result = await api.get(`${baseUrl}/edit`, {
        oldname: oldName,
        newname: newName,
      })
    } catch {
      result = await api.get(`${baseUrl}/edit`, {
        oldname: oldName,
        newname: newName,
      })
    }
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [REMOVE]: async ({ commit }, name) => {
    let result
    try {
      result = await api.get(`${baseUrl}/remove`, { name })
    } catch {
      result = await api.get(`${baseUrl}/remove`, { name })
    }
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
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
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
    commit(FINISH_LOADING)
  },
  [LIKE]: async ({ commit }, { name, id }) => {
    let result
    try {
      result = await api.get(`${baseUrl}/like`, { name, id })
    } catch {
      result = await api.get(`${baseUrl}/like`, { name, id })
    }
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [DISLIKE]: async ({ commit }, { name, id }) => {
    let result
    try {
      result = await api.get(`${baseUrl}/dislike`, { name, id })
    } catch {
      result = await api.get(`${baseUrl}/dislike`, { name, id })
    }
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [BLACK]: async ({ commit }, id) => {
    let result
    try {
      result = await api.get(`${baseUrl}/black`, { id })
    } catch {
      result = await api.get(`${baseUrl}/black`, { id })
    }
    if (!_.isEmpty(result)) commit(SET_COLLECTIONS, result)
  },
  [UNBLACK]: async ({ commit }, id) => {
    let result
    try {
      result = await api.get(`${baseUrl}/unblack`, { id })
    } catch {
      result = await api.get(`${baseUrl}/unblack`, { id })
    }
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
