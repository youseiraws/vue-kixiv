import moment from 'moment'
import api from '../../api'

const dateFormat = 'YYYY-MM-DD'

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const INIT_PAGE = 'INIT_PAGE'
const ADD_PAGE = 'ADD_PAGE'
const ADD_DATE = 'ADD_DATE'
const SUB_DATE = 'SUB_DATE'
const SET_DATE = 'SET_DATE'
const CLEAR_DAILY = 'CLEAR_DAILY'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_DAILY_LOADED = 'ALREADY_DAILY_LOADED'
const NOT_YET_DAILY_LOADED = 'NOT_YET_DAILY_LOADED'

/** action-types **/
const REQUEST_POSTS = 'REQUEST_POSTS'
const LOAD_DAILY = 'LOAD_DAILY'
const PREV_DAILY = 'PREV_DAILY'
const NEXT_DAILY = 'NEXT_DAILY'
const HAS_ALL_CACHED = 'HAS_ALL_CACHED'

const state = {
  date: moment()
    .utc()
    .format(dateFormat),
  page: 1,
  latest: {},

  isLoading: false,
  hasDailyLoaded: false,
}

const getters = {
  date: state => state.date,
  latest: state => state.latest,
  daily: state => state.latest[state.date],
  isLoading: state => state.isLoading,
  isDailyEmpty: state => state.latest[state.date] === undefined,
  isLatestEmpty: state => Object.keys(state.latest).length === 0,
  hasNextDaily: state =>
    moment.utc(state.date, dateFormat).isBefore(moment.utc(), 'day'),
}

const mutations = {
  [ADD_POSTS]: (state, posts) => {
    if (state.latest[state.date] === undefined)
      state.latest = { ...state.latest, [state.date]: [] }
    state.latest[state.date].push(...posts)
  },
  [INIT_PAGE]: state => (state.page = 1),
  [ADD_PAGE]: state => state.page++,
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
  [SET_DATE]: (state, date) => (state.date = date),
  [CLEAR_DAILY]: state => {
    if (state.latest[state.date] !== undefined)
      state.latest[state.date] = state.latest[state.date].splice()
  },
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_DAILY_LOADED]: state => (state.hasDailyLoaded = true),
  [NOT_YET_DAILY_LOADED]: state => (state.hasDailyLoaded = false),
}

const actions = {
  [REQUEST_POSTS]: async ({ state, commit }) => {
    const result = await api.get('/post', {
      tags: `date:${state.date}`,
      page: state.page,
    })
    if (result instanceof Array && result.length > 0) {
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
    if (getters.isDailyEmpty || !(await dispatch(HAS_ALL_CACHED))) {
      commit(NOT_YET_DAILY_LOADED)
      commit(INIT_PAGE)
      commit(CLEAR_DAILY)
      while (!state.hasDailyLoaded) {
        await dispatch(REQUEST_POSTS)
      }
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
  [HAS_ALL_CACHED]: ({ state }) => {
    if (state.latest[state.date] === undefined) return false
    return state.latest[state.date].every(
      post =>
        post.storage !== undefined &&
        post.storage.preview_url !== undefined &&
        post.storage.sample_url !== undefined,
    )
  },
}

export { LOAD_DAILY, PREV_DAILY, NEXT_DAILY }

export default {
  state,
  getters,
  mutations,
  actions,
}
