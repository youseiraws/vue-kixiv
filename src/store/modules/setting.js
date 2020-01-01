/** mutations-types **/
const SET_CONTAIN = 'SET_CONTAIN'
const SET_CAROUSELS_INTERVAL = 'SET_CAROUSELS_INTERVAL'

const state = {
  contain: false,
  carouselsInterval: 6,
}

const getters = {
  contain: state => state.contain,
  carouselsInterval: state => state.carouselsInterval,
}

const mutations = {
  [SET_CONTAIN]: (state, contain) => (state.contain = contain),
  [SET_CAROUSELS_INTERVAL]: (state, carouselsInterval) =>
    (state.carouselsInterval = carouselsInterval),
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
