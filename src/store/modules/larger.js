/** mutations-types **/
const SHOW_LARGER = 'SHOW_LARGER'
const HIDE_LARGER = 'HIDE_LARGER'
const INIT_POST = 'INIT_POST'
const SET_POST = 'SET_POST'
const INIT_POSTS = 'INIT_POSTS'
const SET_POSTS = 'SET_POSTS'

/** actions-types **/
const OPEN_LARGER = 'OPEN_LARGER'
const CLOSE_LARGER = 'CLOSE_LARGER'

const state = {
  overlay: false,
  post: {},
  posts: [],
}

const getters = {
  overlay: state => state.overlay,
  post: state => state.post,
  posts: state => state.posts,
  index: state => state.posts.findIndex(post => post.id === state.post.id),
}

const mutations = {
  [SHOW_LARGER]: state => (state.overlay = true),
  [HIDE_LARGER]: state => (state.overlay = false),
  [INIT_POST]: state => (state.post = {}),
  [SET_POST]: (state, post) => (state.post = post),
  [INIT_POSTS]: state => (state.posts = []),
  [SET_POSTS]: (state, posts) => (state.posts = posts),
}

const actions = {
  [OPEN_LARGER]: ({ commit }, payload) => {
    commit(SET_POST, payload.post)
    commit(SET_POSTS, payload.posts)
    commit(SHOW_LARGER)
  },
  [CLOSE_LARGER]: ({ commit }) => {
    commit(INIT_POST)
    commit(INIT_POSTS)
    commit(HIDE_LARGER)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
