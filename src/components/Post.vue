<template>
  <div id="post">
    <v-hover #default="{hover}">
      <v-menu
        v-model="menu"
        offset-x
        open-on-hover
        :close-on-content-click="false"
        :open-delay="500"
        :close-delay="500"
        :nudge-right="6"
        transition="scroll-x-transition"
      >
        <template #activator="{on}">
          <v-card
            v-on="on"
            outlined
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
          <v-card outlined :width="300">
            <v-card-text>
              <info-row text="评分" :value="score"></info-row>
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
                  <v-chip-group column dark active-class="white">
                    <v-chip
                      v-for="tag in post.storage.tags"
                      :key="tag.id"
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
import { getTagColor, getPostUrl, capitalToRating } from '../util/util'
import InfoRow from './InfoRow'

const { mapMutations, mapActions } = createNamespacedHelpers('larger')
const dateDisplayFormat = 'YYYY年MM月DD日'

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
      menu: false,
      isShow: false,
    }
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
  watch: {
    posts: {
      handler(newPosts) {
        this.setPosts(newPosts)
      },
      deep: true,
      immediate: true,
    },
    menu(newMenu) {
      if (newMenu === false) this.isShow = false
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
      this.menu = false
      this.$router.push({ name: 'tag', params: { name } })
    },
  },
}
</script>

<style>
</style>
