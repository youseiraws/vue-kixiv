import _ from 'lodash'
import moment from 'moment'
import api from '../../api'

const dateFormat = 'YYYY-MM-DD'

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const INIT_DATE = 'INIT_DATE'
const SET_DATE = 'SET_DATE'
const ADD_DATE = 'ADD_DATE'
const SUB_DATE = 'SUB_DATE'
const SET_TYPE = 'SET_TYPE'
const CLEAR_POPULAR = 'CLEAR_POPULAR'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_CACHED = 'ALREADY_CACHED'
const NOT_YET_CACHED = 'NOT_YET_CACHED'

/** actions-types **/
const LOAD_DURATION = 'LOAD_DURATION'
const PREV_DURATION = 'PREV_DURATION'
const NEXT_DURATION = 'NEXT_DURATION'
const SEARCH_DURATION = 'SEARCH_DURATION'
const REFRESH_DURATION = 'REFRESH_DURATION'

const state = {
  date: moment.utc().subtract(1, 'days'),
  type: 'day',
  popular: {},
  isLoading: false,
  hasCached: false,
}

const getters = {
  date: state => state.date,
  startDate: state => {
    switch (state.type) {
      case 'day':
        return state.date.clone()
      case 'week':
        return state.date.clone().isoWeekday('Monday')
      case 'month':
        return state.date.clone().date(1)
    }
  },
  formatedDate: (state, getters) => getters.startDate.format(dateFormat),
  type: state => state.type,
  popular: (state, getters, rootState, rootGetters) =>
    Object.fromEntries(
      Object.entries(state.popular).map(([key, value]) => [
        key,
        value.map(id => rootGetters['post/posts'].find(post => post.id === id)),
      ]),
    ),
  duration: (state, getters) => getters.popular[getters.formatedDate],
  total: (state, getters) => Object.values(getters.popular).flat(),
  isLoading: state => state.isLoading,
  isDurationEmpty: (state, getters) =>
    _.isEmpty(getters.popular[getters.formatedDate]),
  hasNextDuration: state =>
    state.date.isBefore(
      moment.utc().subtract(1, 'days'),
      state.type === 'week' ? 'isoWeek' : state.type,
    ),
  hasCached: state => state.hasCached,
}

const mutations = {
  [ADD_POSTS]: (state, { date, posts }) =>
    (state.popular = {
      ...state.popular,
      [date.format(dateFormat)]: posts.map(post => post.id),
    }),
  [INIT_DATE]: state => (state.date = moment.utc().subtract(1, 'days')),
  [SET_DATE]: (state, date) => (state.date = date),
  [ADD_DATE]: state =>
    (state.date = state.date.clone().add(1, `${state.type}s`)),
  [SUB_DATE]: state =>
    (state.date = state.date.clone().subtract(1, `${state.type}s`)),
  [SET_TYPE]: (state, type) => (state.type = type),
  [CLEAR_POPULAR]: state => (state.popular = {}),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_CACHED]: state => (state.hasCached = true),
  [NOT_YET_CACHED]: state => (state.hasCached = false),
}

const actions = {
  [LOAD_DURATION]: async (
    { state, getters, commit, dispatch },
    date = state.date,
  ) => {
    if (state.isLoading) return
    commit(START_LOADING)
    commit(SET_DATE, date)
    if (getters.isDurationEmpty) {
      commit(NOT_YET_CACHED)
      let result
      try {
        result = await api.get('/popular', {
          type: state.type,
          day: getters.startDate.date(),
          month: getters.startDate.month() + 1,
          year: getters.startDate.year(),
        })
      } catch {
        result = await api.get('/popular', {
          type: state.type,
          day: getters.startDate.date(),
          month: getters.startDate.month() + 1,
          year: getters.startDate.year(),
        })
      }
      if (!_.isEmpty(result)) {
        commit(ADD_POSTS, { date: getters.startDate, posts: result })
        commit('post/ADD_POSTS', result, { root: true })
      }
    } else {
      const notCachedPosts = await dispatch(
        'post/GET_NOT_CACHED_POSTS',
        getters.duration,
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
  [PREV_DURATION]: async ({ commit, dispatch }) => {
    commit(SUB_DATE)
    await dispatch(LOAD_DURATION)
  },
  [NEXT_DURATION]: async ({ getters, commit, dispatch }) => {
    if (getters.hasNextDuration) {
      commit(ADD_DATE)
      await dispatch(LOAD_DURATION)
    }
  },
  [SEARCH_DURATION]: async ({ state, commit, dispatch }, type) => {
    if (type === state.type) return
    commit(SET_TYPE, type)
    commit(INIT_DATE)
    commit(CLEAR_POPULAR)
    await dispatch(LOAD_DURATION)
  },
  [REFRESH_DURATION]: async ({ state, dispatch }) => {
    if (!state.hasCached) await dispatch(LOAD_DURATION)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
