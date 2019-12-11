import _ from 'lodash'
import api from '../../api'

const urls = ['preview_url', 'sample_url', 'jpeg_url', 'file_url']

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const INIT_PAGE = 'INIT_PAGE'
const SET_PAGE = 'SET_PAGE'
const ADD_PAGE = 'ADD_PAGE'
const SUB_PAGE = 'SUB_PAGE'
const SET_NAME = 'SET_NAME'
const UPDATE_TAG = 'UPDATE_TAG'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_LOADED = 'ALREADY_LOADED'
const NOT_YET_LOADED = 'NOT_YET_LOADED'
const ALREADY_CACHED = 'ALREADY_CACHED'
const NOT_YET_CACHED = 'NOT_YET_CACHED'

/** actions-types **/
const LOAD_TAG = 'LOAD_TAG'
const PREV_TAG = 'PREV_TAG'
const NEXT_TAG = 'NEXT_TAG'
const REFRESH_TAG = 'REFRESH_TAG'
const GET_NOT_CACHED_POSTS = 'GET_NOT_CACHED_POSTS'

const state = {
  page: 1,
  name: '',
  tags: [],
  isLoading: false,
  hasLoaded: false,
  hasCached: false,
}

const getters = {
  page: state => state.page,
  index: state => state.page - 1,
  size: state => state.tags.length,
  tag: (state, getters) => state.tags[getters.index],
  isLoading: state => state.isLoading,
  isTagEmpty: (state, getters) => _.isEmpty(state.tags[getters.index]),
  hasCached: state => state.hasCached,
  hasPrevPage: state => state.page > 1,
  hasNextPage: (state, getters) =>
    !state.hasLoaded || state.page < getters.size,
}

const mutations = {
  [ADD_POSTS]: (state, posts) => state.tags.push(posts),
  [INIT_PAGE]: state => (state.page = 1),
  [SET_PAGE]: (state, page) => (state.page = page),
  [ADD_PAGE]: state => state.page++,
  [SUB_PAGE]: state => state.page--,
  [SET_NAME]: (state, name) => (state.name = name),
  [UPDATE_TAG]: (state, newPosts) => {
    let tag = state.tags[state.page - 1]
    if (tag !== undefined) {
      newPosts.forEach(newPost => {
        const index = tag.findIndex(post => post.id === newPost.id)
        if (index !== -1)
          tag.splice(index, 1, Object.assign({}, tag[index], newPost))
      })
    }
  },
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_LOADED]: state => (state.hasLoaded = true),
  [NOT_YET_LOADED]: state => (state.hasLoaded = false),
  [ALREADY_CACHED]: state => (state.hasCached = true),
  [NOT_YET_CACHED]: state => (state.hasCached = false),
}

const actions = {
  [LOAD_TAG]: async (
    { state, getters, commit, dispatch },
    { page = state.page, name = state.name },
  ) => {
    if (state.isLoading) return
    commit(START_LOADING)
    commit(SET_PAGE, page)
    commit(SET_NAME, name)
    if (getters.isTagEmpty) {
      commit(NOT_YET_LOADED)
      commit(NOT_YET_CACHED)
      const result = await api.get('/random', {
        page: state.page,
        tags: state.name,
      })
      if (!_.isEmpty(result)) commit(ADD_POSTS, result)
      else commit(ALREADY_LOADED)
    } else {
      const notCachedPosts = await dispatch(GET_NOT_CACHED_POSTS)
      if (!_.isEmpty(notCachedPosts)) {
        commit(NOT_YET_CACHED)
        const result = await api.post('/cache', {
          posts: notCachedPosts,
        })
        if (!_.isEmpty(result)) commit(UPDATE_TAG, result)
      } else commit(ALREADY_CACHED)
    }
    commit(FINISH_LOADING)
  },
  [PREV_TAG]: async ({ getters, commit, dispatch }) => {
    if (getters.hasPrevPage) {
      commit(SUB_PAGE)
      await dispatch(LOAD_TAG)
    }
  },
  [NEXT_TAG]: async ({ getters, commit, dispatch }) => {
    if (getters.hasNextPage) {
      commit(ADD_PAGE)
      await dispatch(LOAD_TAG)
    }
  },
  [REFRESH_TAG]: async ({ state, dispatch }) => {
    if (!state.hasCached) await dispatch(LOAD_TAG)
  },
  [GET_NOT_CACHED_POSTS]: ({ state, getters }) => {
    const tag = state.tags[getters.index]
    if (tag === undefined) return []
    return tag
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}