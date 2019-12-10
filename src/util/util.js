import _ from 'lodash'

function getPostUrl(post, postType) {
  if (_.isEmpty(post)) return
  if (
    post.storage === undefined ||
    post.storage[`${postType}_url`] === undefined
  )
    return post[`${postType}_url`]
  else return post.storage[`${postType}_url`]
}

export { getPostUrl }
