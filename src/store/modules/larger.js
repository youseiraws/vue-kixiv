/** mutations-types **/
const SHOW_LARGER = 'SHOW_LARGER'
const HIDE_LARGER = 'HIDE_LARGER'
const INIT_POST = 'INIT_POST'
const SET_POST = 'SET_POST'
const CLEAR_POSTS = 'CLEAR_POSTS'
const SET_POSTS = 'SET_POSTS'
const INIT_LOAD_MORE = 'INIT_LOAD_MORE'
const SET_LOAD_MORE = 'SET_LOAD_MORE'

/** actions-types **/
const OPEN_LARGER = 'OPEN_LARGER'
const CLOSE_LARGER = 'CLOSE_LARGER'

const state = {
  overlay: false,
  post: {},
  posts: [],
  loadMore: null,
}

const getters = {
  overlay: state => state.overlay,
  post: state => state.post,
  posts: state => state.posts,
  index: state => state.posts.findIndex(post => post.id === state.post.id),
  count: state => state.posts.length,
  loadMore: state => state.loadMore,
}

const mutations = {
  [SHOW_LARGER]: state => (state.overlay = true),
  [HIDE_LARGER]: state => (state.overlay = false),
  [INIT_POST]: state => (state.post = {}),
  [SET_POST]: (state, post) => (state.post = post),
  [CLEAR_POSTS]: state => (state.posts = []),
  [SET_POSTS]: (state, posts) => (state.posts = posts),
  [INIT_LOAD_MORE]: state => (state.loadMore = null),
  [SET_LOAD_MORE]: (state, loadMore) => (state.loadMore = loadMore),
}

const actions = {
  [OPEN_LARGER]: ({ commit }, payload) => {
    commit(SET_POST, payload.post)
    commit(SET_POSTS, payload.posts)
    commit(SET_LOAD_MORE, payload.loadMore)
    commit(SHOW_LARGER)
  },
  [CLOSE_LARGER]: ({ commit }) => {
    commit(INIT_POST)
    commit(CLEAR_POSTS)
    commit(INIT_LOAD_MORE)
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
