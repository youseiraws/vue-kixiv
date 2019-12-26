<template>
  <div id="post">
    <v-hover #default="{hover}">
      <v-menu open-on-hover offset-x transition="scroll-x-transition">
        <template #activator="{on}">
          <v-card
            v-on="on"
            :raised="hover"
            @click="openLarger({post,posts,loadMore})"
            @contextmenu.prevent
          >
            <v-img
              :width="width"
              :aspect-ratio="16/9"
              :src="getPostUrl(post,'sample')"
              :lazy-src="getPostUrl(post,'preview')"
            ></v-img>
          </v-card>
        </template>
        <template>
          <v-card>
            <v-card-text>
              <info-row text="评分" :value="post.score"></info-row>
              <info-row text="评级" :value="rating"></info-row>
              <info-row text="图片尺寸" :value="resolution"></info-row>
              <info-row text="图片大小" :value="size"></info-row>
              <info-row text="作者" :value="author"></info-row>
              <info-row text="上传日期" :value="uploadDate"></info-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon @click="isShow=!isShow">
                <v-icon>{{isShow?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
              </v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="isShow">
                <v-divider></v-divider>
                <v-card-text>
                  <v-chip-group column>
                    <v-chip
                      v-for="tag in post.storage.tags"
                      :key="tag.id"
                      dark
                      small
                      :color="getTagColor(tag)"
                      @click="chipClick(tag.name)"
                    >{{tag.name}}</v-chip>
                  </v-chip-group>
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </template>
      </v-menu>
    </v-hover>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
import {
  tagTypes,
  getTagColor,
  getPostUrl,
  capitalToRating,
} from '../util/util'
import { InfoRow } from './index'

const { mapMutations, mapActions } = createNamespacedHelpers('larger')
const dateFormat = 'YYYY-MM-DD'

export default {
  name: 'Post',
  components: {
    InfoRow,
  },
  props: {
    width: {
      type: Number,
    },
    post: {
      type: Object,
      default() {
        return {}
      },
    },
    posts: {
      type: Array,
      default() {
        return []
      },
    },
    loadMore: {
      type: Function,
    },
  },
  data() {
    return {
      tagTypes,
      isShow: false,
    }
  },
  computed: {
    rating() {
      return capitalToRating(this.post.rating)
    },
    resolution() {
      return `${this.post.width} x ${this.post.height}`
    },
    size() {
      return this.post.file_size / 1024 < 1024
        ? `${(this.file_size / 1024).toFixed(2)} KB`
        : `${(this.file_size / 1024 ** 2).toFixed(2)} MB`
    },
    author() {
      const authorTag = this.post.storage.tags.find(tag => tag.type === 1)
      if (authorTag !== undefined) return authorTag.name
      else return ''
    },
    uploadDate() {
      return moment
        .unix(this.post.create_at)
        .utc()
        .format(dateFormat)
    },
  },
  watch: {
    posts: {
      handler(newPosts) {
        this.setPosts(newPosts)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations({ setPosts: 'SET_POSTS' }),
    ...mapActions({ openLarger: 'OPEN_LARGER' }),
    getTagColor(tag) {
      return getTagColor(tag)
    },
    getPostUrl(post, postType) {
      return getPostUrl(post, postType)
    },
    chipClick(name) {
      this.$router.push({ name: 'tag', params: { name } })
    },
  },
}
</script>

<style scoped>
</style>
