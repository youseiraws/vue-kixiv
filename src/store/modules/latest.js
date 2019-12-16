import _ from 'lodash'
import moment from 'moment'
import api from '../../api'

const dateFormat = 'YYYY-MM-DD'
const urls = ['preview_url', 'sample_url', 'jpeg_url', 'file_url']

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const INIT_PAGE = 'INIT_PAGE'
const ADD_PAGE = 'ADD_PAGE'
const SET_DATE = 'SET_DATE'
const ADD_DATE = 'ADD_DATE'
const SUB_DATE = 'SUB_DATE'
const UPDATE_DAILY = 'UPDATE_DAILY'
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
const GET_NOT_CACHED_POSTS = 'GET_NOT_CACHED_POSTS'

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
  daily: state => state.latest[state.date],
  isLoading: state => state.isLoading,
  isDailyEmpty: state => _.isEmpty(state.latest[state.date]),
  hasNextDaily: state =>
    moment.utc(state.date, dateFormat).isBefore(moment.utc(), 'day'),
  hasCached: state => state.hasCached,
}

const mutations = {
  [ADD_POSTS]: (state, posts) => {
    if (state.latest[state.date] === undefined)
      state.latest = { ...state.latest, [state.date]: [] }
    state.latest[state.date].push(...posts)
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
  [UPDATE_DAILY]: (state, newPosts) => {
    let daily = state.latest[state.date]
    if (daily !== undefined) {
      newPosts.forEach(newPost => {
        const index = daily.findIndex(post => post.id === newPost.id)
        if (index !== -1)
          daily.splice(index, 1, Object.assign({}, daily[index], newPost))
      })
    }
  },
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_DAILY_LOADED]: state => (state.hasDailyLoaded = true),
  [NOT_YET_DAILY_LOADED]: state => (state.hasDailyLoaded = false),
  [ALREADY_CACHED]: state => (state.hasCached = true),
  [NOT_YET_CACHED]: state => (state.hasCached = false),
}

const actions = {
  [REQUEST_POSTS]: async ({ state, commit }) => {
    const result = await api.get('/post', {
      tags: `date:${state.date}`,
      page: state.page,
    })
    if (!_.isEmpty(result)) {
      commit(ADD_POSTS, result)
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
      const notCachedPosts = await dispatch(GET_NOT_CACHED_POSTS)
      if (!_.isEmpty(notCachedPosts)) {
        commit(NOT_YET_CACHED)
        const result = await api.post('/cache', {
          posts: notCachedPosts,
        })
        if (!_.isEmpty(result)) commit(UPDATE_DAILY, result)
      } else commit(ALREADY_CACHED)
    }
    commit(FINISH_LOADING)
  },
  [PREV_DAILY]: async ({ commit, dispatch }) => {
    commit(SUB_DATE)
    await dispatch(LOAD_DAILY)
  },
  [NEXT_DAILY]: async ({ getters, commit, dispatch }) => {
    if (getters.hasNextDaily) {
      commit(ADD_DATE)
      await dispatch(LOAD_DAILY)
    }
  },
  [REFRESH_DAILY]: async ({ state, dispatch }) => {
    if (!state.hasCached) await dispatch(LOAD_DAILY)
  },
  [GET_NOT_CACHED_POSTS]: ({ state }) => {
    const daily = state.latest[state.date]
    if (daily === undefined) return []
    return daily
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
