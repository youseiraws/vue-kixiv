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
      <v-item-group class="larger-actions d-flex flex-column">
        <v-item>
          <post-hover-btn>
            <template #activator="{on}">
              <v-btn v-on="on" icon>
                <v-icon>mdi-information</v-icon>
              </v-btn>
            </template>
            <template>
              <v-card outlined :width="300">
                <v-card-text>
                  <post-info :post="post"></post-info>
                </v-card-text>
              </v-card>
            </template>
          </post-hover-btn>
        </v-item>
        <v-item>
          <post-hover-btn>
            <template #activator="{on}">
              <v-btn v-on="on" icon>
                <v-icon v-if="hasCollected" color="red">mdi-heart</v-icon>
                <v-icon v-else>mdi-heart-outline</v-icon>
              </v-btn>
            </template>
            <template>
              <v-card outlined :width="300">
                <v-card-text>
                  <post-collection :post="post"></post-collection>
                </v-card-text>
              </v-card>
            </template>
          </post-hover-btn>
        </v-item>
        <v-item>
          <post-black-btn :post="post"></post-black-btn>
        </v-item>
        <v-item>
          <post-download-btn :post="post"></post-download-btn>
        </v-item>
        <v-item>
          <post-hover-btn>
            <template #activator="{on}">
              <v-btn v-on="on" icon>
                <v-icon>mdi-tag-outline</v-icon>
              </v-btn>
            </template>
            <template>
              <v-card outlined :width="300">
                <v-card-text>
                  <post-tag :post="post"></post-tag>
                </v-card-text>
              </v-card>
            </template>
          </post-hover-btn>
        </v-item>
      </v-item-group>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import { getPostUrl } from '../util/util'
import {
  PostInfo,
  PostCollection,
  PostBlackBtn,
  PostDownloadBtn,
  PostTag,
  PostHoverBtn,
} from '../components'

export default {
  name: 'Larger',
  components: {
    PostInfo,
    PostCollection,
    PostBlackBtn,
    PostDownloadBtn,
    PostTag,
    PostHoverBtn,
  },
  data() {
    return {
      i: 0,
    }
  },
  computed: {
    ...mapGetters('larger', ['overlay', 'posts', 'index', 'count', 'loadMore']),
    ...mapGetters('collection', ['collections', 'blacklist']),
    post() {
      return this.posts[i]
    },
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
  activated() {
    this.i = this.index
  },
}
</script>

<style scoped>
.larger-carousel {
  width: 84vw;
}

.larger-actions {
  position: fixed;
  top: 16px;
  right: 16px;
}
</style>
