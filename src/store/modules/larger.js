import _ from 'lodash'

/** mutations-types **/
const SHOW_LARGER = 'SHOW_LARGER'
const HIDE_LARGER = 'HIDE_LARGER'
const SET_ORIGIN = 'SET_ORIGIN'
const INIT_ORIGIN = 'INIT_ORIGIN'
const INIT_TAG = 'INIT_TAG'
const SET_TAG = 'SET_TAG'
const INIT_POST = 'INIT_POST'
const SET_POST = 'SET_POST'
const CLEAR_POSTS = 'CLEAR_POSTS'
const SET_POSTS = 'SET_POSTS'
const SET_SHUFFLE = 'SET_SHUFFLE'
const INIT_LOAD_MORE = 'INIT_LOAD_MORE'
const SET_LOAD_MORE = 'SET_LOAD_MORE'

/** actions-types **/
const OPEN_LARGER = 'OPEN_LARGER'
const CLOSE_LARGER = 'CLOSE_LARGER'
const CHANGE_SHUFFLE = 'CHANGE_SHUFFLE'

const state = {
  overlay: false,
  tag: '',
  origin: {},
  post: {},
  posts: [],
  loadMore: null,
  shuffle: false,
}

const getters = {
  overlay: state => state.overlay,
  post: state => state.post,
  posts: state => state.posts,
  loadMore: state => state.loadMore,
  shuffle: state => state.shuffle,
}

const mutations = {
  [SHOW_LARGER]: state => (state.overlay = true),
  [HIDE_LARGER]: state => (state.overlay = false),
  [SET_ORIGIN]: (state, origin) => (state.origin = origin),
  [INIT_ORIGIN]: state => (state.origin = {}),
  [INIT_TAG]: state => (state.tag = ''),
  [SET_TAG]: (state, tag) => (state.tag = tag),
  [INIT_POST]: state => (state.post = {}),
  [SET_POST]: (state, post) => (state.post = post),
  [CLEAR_POSTS]: state => (state.posts = []),
  [SET_POSTS]: (state, payload) => {
    if (state.tag === payload.tag) state.posts = payload.posts
  },
  [SET_SHUFFLE]: (state, shuffle) => (state.shuffle = shuffle),
  [INIT_LOAD_MORE]: state => (state.loadMore = null),
  [SET_LOAD_MORE]: (state, loadMore) => (state.loadMore = loadMore),
}

const actions = {
  [OPEN_LARGER]: ({ commit }, payload) => {
    commit(SET_ORIGIN, _.cloneDeep(payload))
    commit(SET_TAG, payload.tag)
    commit(SET_POST, payload.post)
    commit(SET_POSTS, { tag: payload.tag, posts: payload.posts })
    commit(SET_LOAD_MORE, payload.loadMore)
    commit(SHOW_LARGER)
  },
  [CLOSE_LARGER]: ({ commit }) => {
    commit(INIT_ORIGIN)
    commit(INIT_TAG)
    commit(INIT_POST)
    commit(CLEAR_POSTS)
    commit(INIT_LOAD_MORE)
    commit(SET_SHUFFLE, false)
    commit(HIDE_LARGER)
  },
  [CHANGE_SHUFFLE]: ({ state, commit }, shuffle) => {
    commit(HIDE_LARGER)
    commit(SET_SHUFFLE, shuffle)
    if (shuffle) {
      const shuffledPosts = _.shuffle(state.origin.posts)
      commit(SET_POST, shuffledPosts[0])
      commit(SET_POSTS, { tag: state.origin.tag, posts: shuffledPosts })
    } else {
      commit(SET_POST, state.origin.post)
      commit(SET_POSTS, { tag: state.origin.tag, posts: state.origin.posts })
    }
    setTimeout(() => commit(SHOW_LARGER), 0)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
