<template>
  <div id="post">
    <v-hover #default="{ hover }">
      <v-card :raised="hover" @click="openLargerPost(post,posts)">
        <v-img
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
    post: {
      type: Object,
      default: () => ({}),
    },
    posts: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    ...mapActions({ openLargerPost: 'OPEN_LARGER_POST' }),
  },
}
</script>

<style scoped>
#post {
  width: 24%;
  margin: 6px;
}
</style>