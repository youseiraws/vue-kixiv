<template>
  <div id="post">
    <v-hover #default="{hover}">
      <v-card :raised="hover" @click="openLarger({post,posts,loadMore})">
        <v-img
          :width="size"
          :aspect-ratio="16/9"
          :src="getPostUrl(post,'sample')"
          :lazy-src="getPostUrl(post,'preview')"
        ></v-img>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { getPostUrl } from '../util/util'

const { mapMutations, mapActions } = createNamespacedHelpers('larger')

export default {
  name: 'Post',
  props: {
    size: {
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
    getPostUrl(post, postType) {
      return getPostUrl(post, postType)
    },
  },
}
</script>

<style scoped>
</style>
