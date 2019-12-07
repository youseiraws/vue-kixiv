import api from '../../api'

const urls = ['preview_url', 'sample_url', 'jpeg_url', 'file_url']

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const SET_PAGE = 'SET_PAGE'
const ADD_PAGE = 'ADD_PAGE'
const SUB_PAGE = 'SUB_PAGE'
const UPDATE_RANDOM = 'UPDATE_RANDOM'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_LOADED = 'ALREADY_LOADED'
const NOT_YET_LOADED = 'NOT_YET_LOADED'
const START_SEARCHING = 'START_SEARCHING'
const FINISH_SEARCHING = 'FINISH_SEARCHING'

/** action-types **/
const LOAD_RANDOM = 'LOAD_RANDOM'
const PREV_RANDOM = 'PREV_RANDOM'
const NEXT_RANDOM = 'NEXT_RANDOM'
const REFRESH_RANDOM = 'REFRESH_RANDOM'
const GET_NOT_CACHED_POSTS = 'GET_NOT_CACHED_POSTS'
const SEARCH_TAG = 'SEARCH_TAG'

const state = {
  page: 1,
  randoms: [],
  isLoading: false,
  hasLoaded: false,
  isSearching: false,
}

const getters = {
  page: state => state.page,
  index: state => state.page - 1,
  size: state => state.randoms.length,
  random: (state, getters) => state.randoms[getters.index],
  isLoading: state => state.isLoading,
  isRandomEmpty: (state, getters) => state.randoms[getters.index] === undefined,
  hasPrevPage: state => state.page > 1,
  hasNextPage: state => !state.hasLoaded,
}

const mutations = {
  [ADD_POSTS]: (state, posts) => state.randoms.push(posts),
  [SET_PAGE]: (state, page) => (state.page = page),
  [ADD_PAGE]: state => state.page++,
  [SUB_PAGE]: state => state.page--,
  [UPDATE_RANDOM]: (state, newPosts) => {
    let random = state.randoms[state.page - 1]
    if (random !== undefined) {
      newPosts.forEach(newPost => {
        const index = random.findIndex(post => post.id === newPost.id)
        if (index !== -1)
          random.splice(index, 1, Object.assign({}, random[index], newPost))
      })
    }
  },
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_LOADED]: state => (state.hasLoaded = true),
  [NOT_YET_LOADED]: state => (state.hasLoaded = false),
}

const actions = {
  [LOAD_RANDOM]: async (
    { state, commit, getters, dispatch },
    page = state.page,
  ) => {
    if (state.isLoading) return
    commit(START_LOADING)
    commit(SET_PAGE, page)
    if (getters.isRandomEmpty) {
      commit(NOT_YET_LOADED)
      const result = await api.get('/random', {
        page: state.page,
      })
      if (result instanceof Array && result.length > 0) {
        commit(ADD_POSTS, result)
      } else {
        commit(ALREADY_LOADED)
      }
    } else {
      const notCachePosts = await dispatch(GET_NOT_CACHED_POSTS)
      if (notCachePosts.length > 0) {
        const result = await api.post('/cache', {
          posts: notCachePosts,
        })
        if (result instanceof Array && result.length > 0) {
          commit(UPDATE_RANDOM, result)
        }
      }
    }
    commit(FINISH_LOADING)
  },
  [PREV_RANDOM]: async ({ getters, commit, dispatch }) => {
    if (getters.hasPrevPage) {
      commit(SUB_PAGE)
      await dispatch(LOAD_RANDOM)
    }
  },
  [NEXT_RANDOM]: async ({ getters, commit, dispatch }) => {
    if (getters.hasNextPage) {
      commit(ADD_PAGE)
      await dispatch(LOAD_RANDOM)
    }
  },
  [REFRESH_RANDOM]: async ({ dispatch }) => {
    await dispatch(LOAD_RANDOM)
  },
  [GET_NOT_CACHED_POSTS]: ({ state, getters }) => {
    const random = state.randoms[getters.index]
    if (random === undefined) return []
    return random
      .filter(
        post =>
          post.storage === undefined ||
          urls.some(url => post.storage[url] === undefined),
      )
      .map(post =>
        Object.assign(
          {},
          { id: post.id },
          ...urls.map(url => ({ [url]: post[url] })),
        ),
      )
  },
  [SEARCH_TAG]: async ({ state, commit }, name) => {
    if (state.isSearching) return
    commit(START_SEARCHING)
    const result = await api.get('/tag', {
      order: count,
      name,
    })
    console.log(result)
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
