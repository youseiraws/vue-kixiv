<template>
  <div id="larger">
    <v-overlay class="larger-overlay" :value="overlay">
      <v-hover #default="{hover}">
        <v-carousel
          class="larger-carousel"
          v-model="i"
          :cycle="!hover"
          :continuous="false"
          height="100%"
          hide-delimiters
          hide-delimiter-background
          show-arrows-on-hover
        >
          <v-carousel-item v-for="post in posts" :key="post.id">
            <v-card>
              <v-img
                :aspect-ratio="16/9"
                :src="getPostUrl(post,'file')"
                :lazy-src="getPostUrl(post,'jpeg')"
                @click="closeLarger"
              ></v-img>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </v-hover>
    </v-overlay>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import _ from 'lodash'
import { getPostUrl } from '../util/util'

const { mapGetters, mapActions } = createNamespacedHelpers('larger')

export default {
  name: 'Larger',
  data() {
    return {
      i: 0,
    }
  },
  computed: {
    ...mapGetters(['overlay', 'posts', 'index', 'count', 'loadMore']),
  },
  watch: {
    index(newIndex) {
      this.i = newIndex
    },
    i(newI) {
      if (!_.isFunction(this.loadMore)) return
      if (newI > this.count - 10) this.loadMore()
    },
  },
  methods: {
    ...mapActions({ closeLarger: 'CLOSE_LARGER' }),
    getPostUrl(post, postType) {
      return getPostUrl(post, postType)
    },
  },
}
</script>

<style scoped>
.larger-carousel {
  width: 84vw;
}
</style>
