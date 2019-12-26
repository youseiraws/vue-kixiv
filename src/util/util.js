import _ from 'lodash'

const tagTypes = [
  {
    name: 'any',
    value: '',
    color: '#000000',
  },
  {
    name: 'general',
    value: 0,
    color: '#ffaaae',
  },
  {
    name: 'artist',
    value: 1,
    color: '#cccc00',
  },
  {
    name: 'copyright',
    value: 3,
    color: '#dd00dd',
  },
  {
    name: 'character',
    value: 4,
    color: '#00aa00',
  },
  {
    name: 'style',
    value: 5,
    color: '#ff2020',
  },
  {
    name: 'circle',
    value: 6,
    color: '#00bbbb',
  },
]

function getTagColor(tag) {
  return tagTypes.find(tagType => tagType.value === tag.type).color
}

function getPostUrl(post, postType) {
  if (_.isEmpty(post)) return
  if (
    post.storage === undefined ||
    post.storage[`${postType}_url`] === undefined
  )
    return post[`${postType}_url`]
  else return post.storage[`${postType}_url`]
}

function capitalToRating(rating) {
  switch (rating) {
    case 's':
      return 'Safe'
    case 'q':
      return 'Questionable'
    case 'e':
      return 'Explicit'
    default:
      return 'Unknown'
  }
}

export { tagTypes, getTagColor, getPostUrl, capitalToRating }
