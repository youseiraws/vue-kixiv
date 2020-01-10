/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'

/** actions-types **/

const state = {
  posts: [],
}

const getters = {}

const mutations = {
  [ADD_POSTS]: (state, posts) => {
    posts.forEach(post => {
      if (!state.posts.includes(post)) state.posts.push(post)
    })
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
