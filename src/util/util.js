function getPostUrl(post, postType) {
  if (post === null) return
  if (
    post.storage === undefined ||
    post.storage[`${postType}_url`] === undefined
  )
    return post[`${postType}_url`]
  else return post.storage[`${postType}_url`]
}

export { getPostUrl }
