import _ from 'lodash'
import api from '../../api'

const urls = ['preview_url', 'sample_url', 'jpeg_url', 'file_url']

/** mutations-types **/
const ADD_POSTS = 'ADD_POSTS'

/** actions-types **/
const GET_NOT_CACHED_POSTS = 'GET_NOT_CACHED_POSTS'
const CROP = 'CROP'
const RELOAD = 'RELOAD'

const state = {
  posts: [],
}

const getters = {
  posts: state => state.posts,
}

const mutations = {
  [ADD_POSTS]: (state, addedPosts) => {
    addedPosts.forEach(addedPost => {
      if (_.isObject(addedPost.storage))
        Object.keys(addedPost.storage)
          .filter(key => key.includes('url'))
          .forEach(url => {
            addedPost.storage[url] += `?ver=${Date.now()}`
          })
      const index = state.posts.findIndex(post => post.id === addedPost.id)
      if (index === -1) state.posts.push(addedPost)
      else
        state.posts.splice(
          index,
          1,
          Object.assign({}, state.posts[index], addedPost, {
            storage: { ...state.posts[index].storage, ...addedPost.storage },
          }),
        )
    })
  },
}

const actions = {
  [GET_NOT_CACHED_POSTS]: ({}, posts) => {
    return posts
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
  [CROP]: async ({ commit }, { post, crop }) => {
    try {
      const result = await api.post('/crop', { post, crop })
      if (!_.isEmpty(result)) commit(ADD_POSTS, [result])
    } catch {}
  },
  [RELOAD]: async ({ commit }, { id, postTypes }) => {
    try {
      const result = await api.post('/reload', { id, postTypes })
      if (!_.isEmpty(result)) commit(ADD_POSTS, result)
    } catch {}
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
