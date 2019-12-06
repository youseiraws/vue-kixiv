import api from '../../api'

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const ADD_PAGE = 'ADD_PAGE'
const SUB_PAGE = 'SUB_PAGE'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_LOADED = 'ALREADY_LOADED'
const NOT_YET_LOADED = 'NOT_YET_LOADED'

/** action-types **/
const LOAD_RANDOM = 'LOAD_RANDOM'
const PREV_RANDOM = 'PREV_RANDOM'
const NEXT_RANDOM = 'NEXT_RANDOM'

const state = {
  page: 1,
  randoms: [],
  isLoading: false,
  hasLoaded: false,
}

const getters = {
  page: state => state.page,
  isLoading: state => state.isLoading,
  isRandomEmpty: state => state.randoms[page - 1].length === 0,
  hasPrevPage: state => state.page < 1,
  hasNextPage: state => !state.hasLoaded,
}

const mutations = {
  [ADD_POSTS]: (state, posts) => state.randoms.push(posts),
  [ADD_PAGE]: state => state.page++,
  [SUB_PAGE]: state => state.page--,
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_LOADED]: state => (state.hasLoaded = true),
  [NOT_YET_LOADED]: state => (state.hasLoaded = false),
}

const actions = {
  [LOAD_RANDOM]: async ({ state, commit }) => {
    commit(START_LOADING)
    commit(NOT_YET_LOADED)
    const result = await api.get('/random', {
      page: state.page,
    })
    if (result instanceof Array && result.length > 0) {
      commit(ADD_POSTS, result)
      commit(ADD_PAGE)
    } else {
      commit(ALREADY_LOADED)
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
