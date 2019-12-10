<template>
  <div id="post">
    <v-hover #default="{hover}">
      <v-card :raised="hover" @click="openLargerPost({post,posts})">
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
import { getPostUrl } from '../../util/util'

const { mapActions } = createNamespacedHelpers('largerPost')

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
  },
  methods: {
    ...mapActions({ openLargerPost: 'OPEN_LARGER_POST' }),
    getPostUrl(post, postType) {
      return getPostUrl(post, postType)
    },
  },
}
</script>

<style scoped>
</style>
