import _ from 'lodash'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import imageToBase64 from 'image-to-base64'
import api from '../api'

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
  if (post.storage !== undefined) {
    if (post.storage.crop_url !== undefined) return post.storage.crop_url
    else return post.storage[`${postType}_url`]
  } else return post[`${postType}_url`]
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

async function downloadImage(url) {
  if (_.isEmpty(url)) return
  url = url.split('?ver=')[0]
  saveAs(url, url.split('/').reverse()[0])
}

async function downloadImages(urls, name) {
  if (_.isEmpty(urls)) return
  if (urls.length === 1) {
    await downloadImage(urls[0])
    return
  }
  const zip = new JSZip()
  await Promise.all(
    urls.map(async url => {
      url = url.split('?ver=')[0]
      const result = await api.download(url)
      const blob = new Blob([result])
      zip.file(url.split('/').reverse()[0], blob, { base64: true })
    }),
  )
  zip
    .generateAsync({ type: 'blob' })
    .then(content => saveAs(content, `${name}.zip`))
}

export {
  tagTypes,
  getTagColor,
  getPostUrl,
  capitalToRating,
  downloadImage,
  downloadImages,
  imageToBase64,
}
