/** mutations-types **/
const SET_CONTAIN = 'SET_CONTAIN'
const SET_RATING = 'SET_RATING'
const SET_CAROUSELS_INTERVAL = 'SET_CAROUSELS_INTERVAL'
const SET_PAGE_SIZE = 'SET_PAGE_SIZE'

const state = {
  contain: false,
  rating: ['s', 'q', 'e'],
  carouselsInterval: 6,
  pageSize: 100,
}

const getters = {
  contain: state => state.contain,
  rating: state => state.rating,
  carouselsInterval: state => state.carouselsInterval,
  pageSize: state => state.pageSize,
}

const mutations = {
  [SET_CONTAIN]: (state, contain) => (state.contain = contain),
  [SET_RATING]: (state, rating) => (state.rating = rating),
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
