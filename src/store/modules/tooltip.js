/** mutations-types **/
const SET_VISIBILITY = 'SET_VISIBILITY'
const SET_CONTENT = 'SET_CONTENT'
const SET_PROGRESS = 'SET_PROGRESS'
const SET_CLOSE = 'SET_CLOSE'

/** actions-types **/
const SHOW_TIP = 'SHOW_TIP'
const HIDE_TIP = 'HIDE_TIP'

const state = {
  visibility: false,
  content: '',
  progress: false,
  close: false,
}

const getters = {
  visibility: state => state.visibility,
  content: state => state.content,
  progress: state => state.progress,
  close: state => state.close,
}

const mutations = {
  [SET_VISIBILITY]: (state, visibility) => (state.visibility = visibility),
  [SET_CONTENT]: (state, content) => (state.content = content),
  [SET_PROGRESS]: (state, progress) => (state.progress = progress),
  [SET_CLOSE]: (state, close) => (state.close = close),
}

const actions = {
  [SHOW_TIP]: (
    { commit, dispatch },
    { content = '', progress = false, close = false },
  ) => {
    dispatch(HIDE_TIP)
    commit(SET_VISIBILITY, true)
    commit(SET_CONTENT, content)
    commit(SET_PROGRESS, progress)
    commit(SET_CLOSE, close)
  },
  [HIDE_TIP]: ({ commit }) => {
    commit(SET_VISIBILITY, false)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
