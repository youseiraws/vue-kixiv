import _ from 'lodash'
import moment from 'moment'
import api from '../../api'

const dateFormat = 'YYYY-MM-DD'
const urls = ['preview_url', 'sample_url', 'jpeg_url', 'file_url']

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const INIT_DATE = 'INIT_DATE'
const SET_DATE = 'SET_DATE'
const ADD_DATE = 'ADD_DATE'
const SUB_DATE = 'SUB_DATE'
const SET_TYPE = 'SET_TYPE'
const UPDATE_DURATION = 'UPDATE_DURATION'
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
const GET_NOT_CACHED_POSTS = 'GET_NOT_CACHED_POSTS'

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
  duration: (state, getters) => state.popular[getters.formatedDate],
  total: state => Object.values(state.popular).flat(),
  isLoading: state => state.isLoading,
  isDurationEmpty: (state, getters) =>
    _.isEmpty(state.popular[getters.formatedDate]),
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
      [date.format(dateFormat)]: posts,
    }),
  [INIT_DATE]: state => (state.date = moment.utc().subtract(1, 'days')),
  [SET_DATE]: (state, date) => (state.date = date),
  [ADD_DATE]: state =>
    (state.date = state.date.clone().add(1, `${state.type}s`)),
  [SUB_DATE]: state =>
    (state.date = state.date.clone().subtract(1, `${state.type}s`)),
  [SET_TYPE]: (state, type) => (state.type = type),
  [UPDATE_DURATION]: (state, { date, newPosts }) => {
    let duration = state.popular[date.format(dateFormat)]
    if (duration !== undefined) {
      newPosts.forEach(newPost => {
        const index = duration.findIndex(post => post.id === newPost.id)
        if (index !== -1)
          duration.splice(
            index,
            1,
            Object.assign({}, duration[index], {
              storage: { ...duration[index].storage, ...newPost.storage },
            }),
          )
      })
    }
  },
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
      if (!_.isEmpty(result))
        commit(ADD_POSTS, { date: getters.startDate, posts: result })
    } else {
      const notCachedPosts = await dispatch(GET_NOT_CACHED_POSTS)
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
        if (!_.isEmpty(result))
          commit(UPDATE_DURATION, { date: getters.startDate, newPosts: result })
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
  [GET_NOT_CACHED_POSTS]: ({ state, getters }) => {
    const duration = state.popular[getters.formatedDate]
    if (duration === undefined) return []
    return duration
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
