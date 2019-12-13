import _ from 'lodash'
import moment from 'moment'
import api from '../../api'

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'
const SET_DATE = 'SET_DATE'
const ADD_DATE = 'ADD_DATE'
const SUB_DATE = 'SUB_DATE'
const START_LOADING = 'START_LOADING'
const FINISH_LOADING = 'FINISH_LOADING'
const ALREADY_CACHED = 'ALREADY_CACHED'
const NOT_YET_CACHED = 'NOT_YET_CACHED'

/** actions-types **/
const LOAD_DURATION = 'LOAD_DURATION'
const PREV_DURATION = 'PREV_DURATION'
const NEXT_DURATION = 'NEXT_DURATION'

const state = {
  date: moment.utc().subtract(1, 'days'),
  type: 'day',
  popular: {},
  isLoading: false,
  hasCached: false,
}

const getters = {
  convertedDate: state => {
    switch (state.type) {
      case 'day':
        return state.date
      case 'week':
        return state.date.day('Monday')
      case 'month':
        return state.date.date(1)
    }
  },
  isDurationEmpty: state => _.isEmpty(state.popular[state.date]),
}

const mutations = {
  [ADD_POSTS]: (state, posts) => {
    if (state.popular[state.date] === undefined)
      state.popular = { ...state.popular, [state.date]: [] }
    state.popular[state.date].push(...posts)
  },
  [SET_DATE]: (state, date) => (state.date = date),
  [ADD_DATE]: state => (state.date = state.date.add(1, `${state.type}s`)),
  [SUB_DATE]: state => (state.date = state.date.subtract(1, `${state.type}s`)),
  [START_LOADING]: state => (state.isLoading = true),
  [FINISH_LOADING]: state => (state.isLoading = false),
  [ALREADY_CACHED]: state => (state.hasCached = true),
  [NOT_YET_CACHED]: state => (state.hasCached = false),
}

const actions = {
  [LOAD_DURATION]: async ({ state, getters, commit }, date = state.date) => {
    if (state.isLoading) return
    commit(START_LOADING)
    commit(SET_DATE, date)
    if (getters.isDurationEmpty) {
      commit(NOT_YET_CACHED)
      const result = await api.get('/popular', {
        type: state.type,
        day: getters.convertedDate.date(),
        month: getters.convertedDate.month(),
        year: getters.convertedDate.year(),
      })
      if (!_.isEmpty(result)) commit(ADD_POSTS, result)
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
