import _ from 'lodash'
import api from '../../api'

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const INIT_PAGE = 'INIT_PAGE'
const SET_PAGE = 'SET_PAGE'
const ADD_PAGE = 'ADD_PAGE'
const SUB_PAGE = 'SUB_PAGE'
const CLEAR_RANDOMS = 'CLEAR_RANDOMS'
const SET_TAGS = 'SET_TAGS'
const CLEAR_ITEMS = 'CLEAR_ITEMS'
const SET_ITEMS = 'SET_ITEMS'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_LOADED = 'ALREADY_LOADED'
const NOT_YET_LOADED = 'NOT_YET_LOADED'
const ALREADY_CACHED = 'ALREADY_CACHED'
const NOT_YET_CACHED = 'NOT_YET_CACHED'
const START_SEARCHING = 'START_SEARCHING'
const FINISH_SEARCHING = 'FINISH_SEARCHING'

/** actions-types **/
const LOAD_RANDOM = 'LOAD_RANDOM'
const PREV_RANDOM = 'PREV_RANDOM'
const NEXT_RANDOM = 'NEXT_RANDOM'
const SEARCH_RANDOM = 'SEARCH_RANDOM'
const REFRESH_RANDOM = 'REFRESH_RANDOM'
const SEARCH_TAG = 'SEARCH_TAG'

const state = {
  page: 1,
  randoms: [],
  tags: [],
  items: [],
  isLoading: false,
  hasLoaded: false,
  hasCached: false,
  isSearching: false,
}

const getters = {
  page: state => state.page,
  index: state => state.page - 1,
  randoms: (state, getters, rootState, rootGetters) =>
    state.randoms.map(random =>
      random.map(id => rootGetters['post/posts'].find(post => post.id === id)),
    ),
  size: (state, getters) => getters.randoms.length,
  random: (state, getters) => getters.randoms[getters.index],
  total: (state, getters) => getters.randoms.flat(),
  tagStr: state => state.tags.map(tag => tag.name).join(' '),
  items: state => state.items,
  isLoading: state => state.isLoading,
  isRandomEmpty: (state, getters) => _.isEmpty(getters.randoms[getters.index]),
  hasCached: state => state.hasCached,
  hasPrevPage: state => state.page > 1,
  hasNextPage: (state, getters) =>
    !state.hasLoaded || state.page < getters.size,
  isSearching: state => state.isSearching,
}

const mutations = {
  [ADD_POSTS]: (state, posts) => state.randoms.push(posts.map(post => post.id)),
  [INIT_PAGE]: state => (state.page = 1),
  [SET_PAGE]: (state, page) => (state.page = page),
  [ADD_PAGE]: state => state.page++,
  [SUB_PAGE]: state => state.page--,
  [CLEAR_RANDOMS]: state => (state.randoms = []),
  [SET_TAGS]: (state, tags) => (state.tags = tags),
  [CLEAR_ITEMS]: state =>
    (state.items = state.items.filter(item => state.tags.includes(item))),
  [SET_ITEMS]: (state, items = []) => (state.items = state.tags.concat(items)),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_LOADED]: state => (state.hasLoaded = true),
  [NOT_YET_LOADED]: state => (state.hasLoaded = false),
  [ALREADY_CACHED]: state => (state.hasCached = true),
  [NOT_YET_CACHED]: state => (state.hasCached = false),
  [START_SEARCHING]: state => (state.isSearching = true),
  [FINISH_SEARCHING]: state => (state.isSearching = false),
}

const actions = {
  [LOAD_RANDOM]: async (
    { state, getters, commit, dispatch },
    page = state.page,
  ) => {
    if (state.isLoading) return
    commit(START_LOADING)
    commit(SET_PAGE, page)
    if (getters.isRandomEmpty) {
      commit(NOT_YET_LOADED)
      commit(NOT_YET_CACHED)
      let result
      try {
        result = await api.get('/random', {
          page: state.page,
          tags: getters.tagStr,
        })
      } catch {
        result = await api.get('/random', {
          page: state.page,
          tags: getters.tagStr,
        })
      }
      if (!_.isEmpty(result)) {
        commit(ADD_POSTS, result)
        commit('post/ADD_POSTS', result, { root: true })
      } else commit(ALREADY_LOADED)
    } else {
      const notCachedPosts = await dispatch(
        'post/GET_NOT_CACHED_POSTS',
        getters.random,
        { root: true },
      )
      if (!_.isEmpty(notCachedPosts)) {
        commit(NOT_YET_CACHED)
        let result
        try {
          result = await api.post('/cache', {
            posts: notCachedPosts,
          })
        } catch {
          result = await api.post('/cache', {
            posts: notCachedPosts,
          })
        }
        if (!_.isEmpty(result)) commit('post/ADD_POSTS', result, { root: true })
      } else commit(ALREADY_CACHED)
    }
    commit(FINISH_LOADING)
  },
  [PREV_RANDOM]: async ({ state, getters, commit, dispatch }) => {
    if (state.isLoading || !getters.hasPrevPage) return
    commit(SUB_PAGE)
    await dispatch(LOAD_RANDOM)
  },
  [NEXT_RANDOM]: async ({ state, getters, commit, dispatch }) => {
    if (state.isLoading || !getters.hasNextPage) return
    commit(ADD_PAGE)
    await dispatch(LOAD_RANDOM)
  },
  [SEARCH_RANDOM]: async ({ state, commit, dispatch }, tags) => {
    if (_.isEqual(state.tags, tags)) return
    commit(SET_TAGS, tags)
    commit(SET_ITEMS)
    commit(INIT_PAGE)
    commit(CLEAR_RANDOMS)
    await dispatch(LOAD_RANDOM)
  },
  [REFRESH_RANDOM]: async ({ state, dispatch }) => {
    if (!state.hasCached) await dispatch(LOAD_RANDOM)
  },
  [SEARCH_TAG]: async ({ state, commit }, name) => {
    if (state.isSearching) return
    if (_.isEmpty(name)) {
      commit(CLEAR_ITEMS)
      return
    }
    commit(START_SEARCHING)
    let result
    try {
      result = await api.get('/tag', {
        order: 'count',
        limit: 7,
        name,
      })
    } catch {
      result = await api.get('/tag', {
        order: 'count',
        limit: 7,
        name,
      })
    }
    if (!_.isEmpty(result)) commit(SET_ITEMS, result)
    commit(FINISH_SEARCHING)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
