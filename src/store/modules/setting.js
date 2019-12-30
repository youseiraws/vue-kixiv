/** mutations-types **/
const SET_CONTAIN = 'SET_CONTAIN'

const state = {
  contain: false,
}

const getters = {
  contain: state => state.contain,
}

const mutations = {
  [SET_CONTAIN]: (state, contain) => (state.contain = contain),
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
