<template>
  <div id="post-info">
    <info-row text="评分" :value="score"></info-row>
    <info-row text="评级" :value="rating"></info-row>
    <info-row text="图片尺寸" :value="resolution"></info-row>
    <info-row text="图片大小" :value="size"></info-row>
    <info-row text="作者" :value="author"></info-row>
    <info-row text="上传日期" :value="uploadDate"></info-row>
  </div>
</template>

<script>
import moment from 'moment'
import { capitalToRating } from '../util/util'
import InfoRow from './InfoRow'

const dateDisplayFormat = 'YYYY年MM月DD日'

export default {
  name: 'PostInfo',
  components: {
    InfoRow,
  },
  props: {
    post: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    score() {
      return this.post.score.toString()
    },
    rating() {
      return capitalToRating(this.post.rating)
    },
    resolution() {
      return `${this.post.width} x ${this.post.height}`
    },
    size() {
      return this.post.file_size / 1024 < 1024
        ? `${(this.post.file_size / 1024).toFixed(2)} KB`
        : `${(this.post.file_size / 1024 ** 2).toFixed(2)} MB`
    },
    author() {
      const authorTag = this.post.storage.tags.find(tag => tag.type === 1)
      if (authorTag !== undefined) return authorTag.name
      else return ''
    },
    uploadDate() {
      return moment
        .unix(this.post.created_at)
        .utc()
        .format(dateDisplayFormat)
    },
  },
}
</script>

<style>
</style>