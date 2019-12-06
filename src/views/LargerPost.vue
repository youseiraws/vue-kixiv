<template>
  <div id="larger-post">
    <v-overlay :value="overlay">
      <v-carousel
        v-model="i"
        class="larger-post-carousel"
        cycle
        :continuous="false"
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
              @click="closeLargerPost"
            ></v-img>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </v-overlay>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { getPostUrl } from '../util/util'

const { mapGetters, mapActions } = createNamespacedHelpers('largerPost')

export default {
  name: 'LargerPost',
  data() {
    return {
      i: this.index,
    }
  },
  computed: {
    ...mapGetters(['overlay', 'posts', 'index']),
  },
  methods: {
    ...mapActions({ closeLargerPost: 'CLOSE_LARGER_POST' }),
  },
}
</script>

<style scoped>
.larger-post-carousel {
  width: 84vw;
}
</style>