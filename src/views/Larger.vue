<template>
  <div id="larger">
    <v-overlay :value="overlay">
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
      <v-btn-toggle class="larger-btns d-flex flex-column" group borderless>
        <v-btn icon @click="showCollections()">
          <v-icon v-if="hasCollected" color="red">mdi-heart</v-icon>
          <v-icon v-else>mdi-heart-outline</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import { getPostUrl } from '../util/util'

export default {
  name: 'Larger',
  data() {
    return {
      i: 0,
    }
  },
  computed: {
    ...mapGetters('larger', ['overlay', 'posts', 'index', 'count', 'loadMore']),
    ...mapGetters('collection', ['collections', 'blacklist']),
    hasCollected() {
      return this.collections.some(collection =>
        collection.posts.map(post => post.id).includes(this.post.id),
      )
    },
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
    ...mapActions('larger', { closeLarger: 'CLOSE_LARGER' }),
    ...mapActions('collection', {
      add: 'ADD',
      edit: 'EDIT',
      remove: 'REMOVE',
      list: 'LIST',
      like: 'LIKE',
      dislike: 'DISLIKE',
      black: 'BLACK',
      unblack: 'UNBLACK',
    }),
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

.larger-btns {
  position: fixed;
  top: 16px;
  right: 16px;
}
</style>
