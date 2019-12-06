/** mutations-types **/
const SHOW_LARGER_POST = 'SHOW_LARGER_POST'
const HIDE_LARGER_POST = 'HIDE_LARGER_POST'
const INIT_POST = 'INIT_POST'
const SET_POST = 'SET_POST'
const INIT_POSTS = 'INIT_POSTS'
const SET_POSTS = 'SET_POSTS'

/** actions-types **/
const OPEN_LARGER_POST = 'SHOW_LARGER_POST'
const CLOSE_LARGER_POST = 'HIDE_LARGER_POST'

const state = {
  overlay: false,
  post: {},
  posts: [],
}

const getters = {
  overlay: state => state.overlay,
  post: state => state.post,
  posts: state => state.posts,
  index: state =>
    (state.index = state.posts.findIndex(post => post.id === state.post.id)),
}

const mutations = {
  [SHOW_LARGER_POST]: state => (state.overlay = true),
  [HIDE_LARGER_POST]: state => (state.overlay = false),
  [INIT_POST]: state => (state.post = {}),
  [SET_POST]: (state, post) => (state.post = post),
  [INIT_POSTS]: state => (state.posts = []),
  [SET_POSTS]: (state, posts) => (state.posts = posts),
}

const actions = {
  [OPEN_LARGER_POST]: ({ commit }, post, posts) => {
    commit(SET_POST, post)
    commit(SET_POSTS, posts)
    commit(SHOW_LARGER_POST)
  },
  [CLOSE_LARGER_POST]: ({ commit }) => {
    commit(INIT_POST)
    commit(INIT_POSTS)
    commit(HIDE_LARGER_POST)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
