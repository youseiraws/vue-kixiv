import _ from 'lodash'
import api from '../../api'

const urls = ['preview_url', 'sample_url']

/** mutations-types **/
const INIT_PAGE = 'INIT_PAGE'
const ADD_PAGE = 'ADD_PAGE'
const SUB_PAGE = 'SUB_PAGE'
const SET_NAME = 'SET_NAME'
const ADD_TAG = 'ADD_TAG'
const CLEAR_TAGS = 'CLEAR_TAGS'
const ADD_COVER = 'ADD_COVER'
const UPDATE_COVER = 'UPDATE_COVER'
const START_SEARCHING = 'START_SEARCHING'
const FINISH_SEARCHING = 'FINISH_SEARCHING'
const ALREADY_SEARCHED = 'ALREADY_SEARCHED'
const NOT_YET_SEARCHED = 'NOT_YET_SEARCHED'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_CACHED = 'ALREADY_CACHED'
const NOT_YET_CACHED = 'NOT_YET_CACHED'
const START_CACHING = 'START_CACHING'
const FINISH_CACHING = 'FINISH_CACHING'

/** actions-types **/
const LOAD_TAG = 'LOAD_TAG'
const PREV_TAG = 'PREV_TAG'
const NEXT_TAG = 'NEXT_TAG'
const SEARCH_TAG = 'SEARCH_TAG'
const LOAD_COVER = 'LOAD_COVER'
const CACHE_COVER = 'CACHE_COVER'
const REFRESH_CATEGORY = 'REFRESH_CATEGORY'
const GET_NOT_CACHED_POSTS = 'GET_NOT_CACHED_POSTS'

const state = {
  page: 1,
  name: '',
  totalTags: [],
  categories: {},
  isSearching: false,
  hasSearched: false,
  isLoading: false,
  hasCached: false,
  isCaching: false,
}

const getters = {
  page: state => state.page,
  index: state => state.page - 1,
  size: state => state.totalTags.length,
  tags: (state, getters) => state.totalTags[getters.index],
  categories: state => state.categories,
  isSearching: state => state.isSearching,
  isTagEmpty: (state, getters) => _.isEmpty(state.totalTags[getters.index]),
  hasPrevPage: state => state.page > 1,
  hasNextPage: (state, getters) =>
    !state.hasSearched || state.page < getters.size,
  hasCached: state => state.hasCached,
  isCaching: state => state.isCaching,
}

const mutations = {
  [INIT_PAGE]: state => (state.page = 1),
  [ADD_PAGE]: state => state.page++,
  [SUB_PAGE]: state => state.page--,
  [SET_NAME]: (state, name) => (state.name = name),
  [ADD_TAG]: (state, tag) => state.totalTags.push(tag),
  [CLEAR_TAGS]: state => (state.totalTags = []),
  [ADD_COVER]: (state, payload) => {
    if (state.categories[payload.tag] === undefined)
      state.categories[payload.tag] = payload.post
  },
  [UPDATE_COVER]: (state, newPosts) => {
    newPosts.forEach(newPost => {
      const oldPost = Object.entries(state.categories).find(
        ([tag, post]) => post.id === newPost.id,
      )
      if (oldPost !== undefined)
        state.categories[oldPost[0]] = Object.assign(
          {},
          state.categories[oldPost[0]],
          newPost,
        )
    })
  },
  [START_SEARCHING]: state => (state.isSearching = true),
  [FINISH_SEARCHING]: state => (state.isSearching = false),
  [ALREADY_SEARCHED]: state => (state.hasSearched = true),
  [NOT_YET_SEARCHED]: state => (state.hasSearched = false),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_CACHED]: state => (state.hasCached = true),
  [NOT_YET_CACHED]: state => (state.hasCached = false),
  [START_CACHING]: state => (state.isCaching = true),
  [FINISH_CACHING]: state => (state.isCaching = false),
}

const actions = {
  [LOAD_TAG]: async ({ state, getters, commit, dispatch }) => {
    if (state.isSearching) return
    commit(START_SEARCHING)
    if (getters.isTagEmpty) {
      commit(NOT_YET_SEARCHED)
      commit(NOT_YET_CACHED)
      const result = await api.get('/tag', {
        order: 'count',
        page: state.page,
        name: state.name,
      })
      if (!_.isEmpty(result)) {
        commit(ADD_TAG, result)
        dispatch(LOAD_COVER)
      } else commit(ALREADY_SEARCHED)
    }
    commit(FINISH_SEARCHING)
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
  [SEARCH_TAG]: async ({ state, commit, dispatch }, name) => {
    if (_.isEqual(state.name, name)) return
    commit(SET_NAME, name)
    commit(INIT_PAGE)
    commit(CLEAR_TAGS)
    await dispatch(LOAD_TAG)
  },
  [LOAD_COVER]: async ({ state, commit }) => {
    if (state.isLoading) return
    commit(START_LOADING)
    while (true) {
      let noCoverTag = {}
      for (let tag of state.totalTags.flat()) {
        if (state.categories[tag.name] === undefined) {
          noCoverTag = tag
          break
        }
      }
      if (!_.isEmpty(noCoverTag)) {
        const result = await api.get('/random', {
          limit: 1,
          tags: noCoverTag.name,
        })
        if (!_.isEmpty(result))
          commit(ADD_COVER, {
            tag: noCoverTag.name,
            post: result[0],
          })
      } else break
    }
    commit(FINISH_LOADING)
  },
  [CACHE_COVER]: async ({ state, commit, dispatch }) => {
    if (state.isCaching) return
    commit(START_CACHING)
    const notCachedPosts = await dispatch(GET_NOT_CACHED_POSTS)
    if (!_.isEmpty(notCachedPosts)) {
      commit(NOT_YET_CACHED)
      const result = await api.post('/cache', {
        posts: notCachedPosts,
      })
      if (!_.isEmpty(result)) commit(UPDATE_COVER, result)
    } else commit(ALREADY_CACHED)
    commit(FINISH_CACHING)
  },
  [REFRESH_CATEGORY]: async ({ state, dispatch }) => {
    await dispatch(CACHE_COVER)
  },
  [GET_NOT_CACHED_POSTS]: ({ state }) => {
    if (_.isEmpty(state.categories)) return
    return Object.values(state.categories)
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
