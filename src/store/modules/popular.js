import _ from 'lodash'
import moment from 'moment'
import api from '../../api'

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const SET_DATE = 'SET_DATE'
const ADD_DATE = 'ADD_DATE'
const SUB_DATE = 'SUB_DATE'
const UPDATE_DURATION = 'UPDATE_DURATION'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_CACHED = 'ALREADY_CACHED'
const NOT_YET_CACHED = 'NOT_YET_CACHED'

/** actions-types **/
const LOAD_DURATION = 'LOAD_DURATION'
const PREV_DURATION = 'PREV_DURATION'
const NEXT_DURATION = 'NEXT_DURATION'
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
        return state.date
      case 'week':
        return state.date.day('Monday')
      case 'month':
        return state.date.date(1)
    }
  },
  type: state => state.type,
  duration: state => state.popular[state.date],
  isLoading: state => state.isLoading,
  isDurationEmpty: state => _.isEmpty(state.popular[state.date]),
  hasNextDuration: state =>
    state.date.isBefore(
      moment.utc().subtract(1, 'days'),
      state.type === 'week' ? 'isoWeek' : state.type,
    ),
  hasCached: state => state.hasCached,
}

const mutations = {
  [ADD_POSTS]: (state, posts) => (state.popular[state.date] = posts),
  [SET_DATE]: (state, date) => (state.date = date),
  [ADD_DATE]: state => (state.date = state.date.add(1, `${state.type}s`)),
  [SUB_DATE]: state => (state.date = state.date.subtract(1, `${state.type}s`)),
  [UPDATE_DURATION]: (state, newPosts) => {
    let duration = state.popular[state.date]
    if (duration !== undefined) {
      newPosts.forEach(newPost => {
        const index = duration.findIndex(post => post.id === newPost.id)
        if (index !== -1)
          duration.splice(index, 1, Object.assign({}, duration[index], newPost))
      })
    }
  },
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
      const result = await api.get('/popular', {
        type: state.type,
        day: getters.startDate.date(),
        month: getters.startDate.month(),
        year: getters.startDate.year(),
      })
      if (!_.isEmpty(result)) commit(ADD_POSTS, result)
    } else {
      const notCachedPosts = await dispatch(GET_NOT_CACHED_POSTS)
      if (!_.isEmpty(notCachedPosts)) {
        commit(NOT_YET_CACHED)
        const result = await api.post('/cache', {
          posts: notCachedPosts,
        })
        if (!_.isEmpty(result)) commit(UPDATE_DURATION, result)
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
  [REFRESH_DURATION]: async ({ state, dispatch }) => {
    if (!state.hasCached) await dispatch(LOAD_DURATION)
  },
  [GET_NOT_CACHED_POSTS]: ({ state }) => {
    const duration = state.popular[state.date]
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
