/** mutations-types **/
const SET_CONTAIN = 'SET_CONTAIN'
const SET_CAROUSELS_INTERVAL = 'SET_CAROUSELS_INTERVAL'
const SET_PAGE_SIZE = 'SET_PAGE_SIZE'

const state = {
  contain: false,
  carouselsInterval: 6,
  pageSize: 100,
}

const getters = {
  contain: state => state.contain,
  carouselsInterval: state => state.carouselsInterval,
  pageSize: state => state.pageSize,
}

const mutations = {
  [SET_CONTAIN]: (state, contain) => (state.contain = contain),
  [SET_CAROUSELS_INTERVAL]: (state, carouselsInterval) =>
    (state.carouselsInterval = carouselsInterval),
  [SET_PAGE_SIZE]: (state, pageSize) => (state.pageSize = pageSize),
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
