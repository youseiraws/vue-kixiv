import _ from 'lodash'
import moment from 'moment'
import api from '../../api'

const dateFormat = 'YYYY-MM-DD'

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const INIT_PAGE = 'INIT_PAGE'
const ADD_PAGE = 'ADD_PAGE'
const SET_DATE = 'SET_DATE'
const ADD_DATE = 'ADD_DATE'
const SUB_DATE = 'SUB_DATE'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_DAILY_LOADED = 'ALREADY_DAILY_LOADED'
const NOT_YET_DAILY_LOADED = 'NOT_YET_DAILY_LOADED'
const ALREADY_CACHED = 'ALREADY_CACHED'
const NOT_YET_CACHED = 'NOT_YET_CACHED'

/** actions-types **/
const REQUEST_POSTS = 'REQUEST_POSTS'
const LOAD_DAILY = 'LOAD_DAILY'
const PREV_DAILY = 'PREV_DAILY'
const NEXT_DAILY = 'NEXT_DAILY'
const REFRESH_DAILY = 'REFRESH_DAILY'

const state = {
  date: moment()
    .utc()
    .format(dateFormat),
  page: 1,
  latest: {},
  isLoading: false,
  hasDailyLoaded: false,
  hasCached: false,
}

const getters = {
  date: state => state.date,
  latest: (state, getters, rootState, rootGetters) =>
    Object.fromEntries(
      Object.entries(state.latest).map(([key, value]) => [
        key,
        value.map(id => rootGetters['post/posts'].find(post => post.id === id)),
      ]),
    ),
  daily: (state, getters) => getters.latest[state.date],
  total: (state, getters) => Object.values(getters.latest).flat(),
  isLoading: state => state.isLoading,
  isDailyEmpty: (state, getters) => _.isEmpty(getters.latest[state.date]),
  hasNextDaily: state =>
    moment.utc(state.date, dateFormat).isBefore(moment.utc(), 'day'),
  hasCached: state => state.hasCached,
}

const mutations = {
  [ADD_POSTS]: (state, posts) => {
    if (state.latest[state.date] === undefined)
      state.latest = { ...state.latest, [state.date]: [] }
    state.latest[state.date].push(...posts.map(post => post.id))
  },
  [INIT_PAGE]: state => (state.page = 1),
  [ADD_PAGE]: state => state.page++,
  [SET_DATE]: (state, date) => (state.date = date),
  [ADD_DATE]: state =>
    (state.date = moment
      .utc(state.date, dateFormat)
      .add(1, 'days')
      .format(dateFormat)),
  [SUB_DATE]: state =>
    (state.date = moment
      .utc(state.date, dateFormat)
      .subtract(1, 'days')
      .format(dateFormat)),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_DAILY_LOADED]: state => (state.hasDailyLoaded = true),
  [NOT_YET_DAILY_LOADED]: state => (state.hasDailyLoaded = false),
  [ALREADY_CACHED]: state => (state.hasCached = true),
  [NOT_YET_CACHED]: state => (state.hasCached = false),
}

const actions = {
  [REQUEST_POSTS]: async ({ state, commit }) => {
    let result
    try {
      result = await api.get('/post', {
        tags: `date:${state.date}`,
        page: state.page,
      })
    } catch {
      result = await api.get('/post', {
        tags: `date:${state.date}`,
        page: state.page,
      })
    }

    if (!_.isEmpty(result)) {
      commit(ADD_POSTS, result)
      commit('post/ADD_POSTS', result, { root: true })
      commit(ADD_PAGE)
    } else {
      commit(ALREADY_DAILY_LOADED)
      commit(INIT_PAGE)
    }
  },
  [LOAD_DAILY]: async (
    { state, getters, commit, dispatch },
    date = state.date,
  ) => {
    if (state.isLoading) return
    commit(START_LOADING)
    commit(SET_DATE, date)
    if (getters.isDailyEmpty) {
      commit(NOT_YET_DAILY_LOADED)
      commit(NOT_YET_CACHED)
      commit(INIT_PAGE)
      while (!state.hasDailyLoaded) {
        await dispatch(REQUEST_POSTS)
      }
    } else {
      const notCachedPosts = await dispatch(
        'post/GET_NOT_CACHED_POSTS',
        getters.daily,
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
  [PREV_DAILY]: async ({ state, commit, dispatch }) => {
    if (state.isLoading) return
    commit(SUB_DATE)
    commit(NOT_YET_CACHED)
    await dispatch(LOAD_DAILY)
  },
  [NEXT_DAILY]: async ({ state, getters, commit, dispatch }) => {
    if (state.isLoading || !getters.hasNextDaily) return
    commit(ADD_DATE)
    commit(NOT_YET_CACHED)
    await dispatch(LOAD_DAILY)
  },
  [REFRESH_DAILY]: async ({ state, dispatch }) => {
    if (!state.hasCached) await dispatch(LOAD_DAILY)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
