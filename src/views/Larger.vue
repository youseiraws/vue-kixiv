<template>
  <div id="larger">
    <v-overlay :value="overlay">
      <v-hover #default="{hover}">
        <div>
          <v-card v-if="isCropping" class="larger-container">
            <clipper-basic
              ref="clipper"
              :src="getPostUrl(currentPost,'file')"
              :ratio="16/9"
              :init-width="100"
              :init-height="100"
            ></clipper-basic>
          </v-card>
          <v-carousel
            v-else
            class="larger-container"
            v-model="indexModel"
            :cycle="!hover&&cycle"
            :interval="interval"
            :continuous="false"
            height="100%"
            hide-delimiters
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item v-for="post in unblackedPosts" :key="post.id">
              <v-card>
                <v-img
                  :contain="contain"
                  :aspect-ratio="16/9"
                  :src="getPostUrl(post,'file')"
                  :lazy-src="getPostUrl(post,'jpeg')"
                  @click="closeLarger()"
                ></v-img>
              </v-card>
            </v-carousel-item>
          </v-carousel>
          <v-item-group class="larger-actions d-flex flex-column justify-space-between">
            <v-item>
              <post-hover-btn large>
                <template #icon>
                  <v-icon>mdi-information-outline</v-icon>
                </template>
                <template>
                  <v-card outlined :width="300">
                    <v-card-text>
                      <post-info :post="currentPost"></post-info>
                    </v-card-text>
                  </v-card>
                </template>
              </post-hover-btn>
            </v-item>
            <v-item>
              <post-hover-btn
                large
                :menu="menu"
                :open-on-hover="openOnHover"
                @menu-changed="changeMenu"
              >
                <template #icon>
                  <v-icon v-if="hasCollected" color="red">mdi-heart</v-icon>
                  <v-icon v-else>mdi-heart-outline</v-icon>
                </template>
                <template>
                  <v-card outlined :width="300">
                    <post-collection
                      :post="currentPost"
                      :menu="menu"
                      @dialog-opened="setVisibility(true)"
                      @dialog-closed="setVisibility(false)"
                    ></post-collection>
                  </v-card>
                </template>
              </post-hover-btn>
            </v-item>
            <v-item>
              <post-black-btn :post="currentPost" large @post-blacked="closeLarger()"></post-black-btn>
            </v-item>
            <v-item>
              <post-download-btn :post="currentPost" large></post-download-btn>
            </v-item>
            <v-item>
              <v-btn icon @click="cropPost()">
                <v-icon>mdi-crop</v-icon>
              </v-btn>
            </v-item>
            <v-item>
              <post-hover-btn large>
                <template #icon>
                  <v-icon>mdi-tag-outline</v-icon>
                </template>
                <template>
                  <v-card outlined :width="300">
                    <v-card-text>
                      <post-tag :post="currentPost" @tag-clicked="closeLarger()"></post-tag>
                    </v-card-text>
                  </v-card>
                </template>
              </post-hover-btn>
            </v-item>
            <v-spacer></v-spacer>
            <v-item>
              <v-btn icon @click="confirmCrop()">
                <v-icon color="green">mdi-check-circle</v-icon>
              </v-btn>
            </v-item>
            <v-item>
              <v-btn icon @click="cancelCrop()">
                <v-icon color="red">mdi-close-circle</v-icon>
              </v-btn>
            </v-item>
          </v-item-group>
        </div>
      </v-hover>
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
      indexModel: 0,
      menu: true,
      openOnHover: true,
      isCropping: false,
    }
  },
  computed: {
    ...mapGetters('larger', ['overlay', 'post', 'posts', 'loadMore']),
    ...mapGetters('collection', ['collections', 'blacklist']),
    ...mapGetters('setting', ['contain', 'rating', 'carouselsInterval']),
    unblackedPosts() {
      return this.posts.filter(
        post =>
          !this.blacklist.posts.map(post => post.id).includes(post.id) &&
          this.rating.includes(post.rating),
      )
    },
    index() {
      return this.unblackedPosts.findIndex(post => post.id === this.post.id)
    },
    count() {
      return this.unblackedPosts.length
    },
    currentPost() {
      return this.unblackedPosts[this.indexModel]
    },
    hasCollected() {
      return this.collections.some(collection =>
        collection.posts.map(post => post.id).includes(this.currentPost.id),
      )
    },
    cycle() {
      return this.carouselsInterval !== 0 && !this.isCropping
    },
    interval() {
      if (this.carouselsInterval !== 0) return this.carouselsInterval * 1000
    },
  },
  watch: {
    index(newIndex) {
      if (newIndex === -1) return
      this.indexModel = newIndex
    },
    indexModel(newIndexModel) {
      if (!_.isFunction(this.loadMore)) return
      if (newIndexModel > this.count - 10) this.loadMore()
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
    changeMenu(newMenu) {
      this.menu = newMenu
    },
    setVisibility(visible) {
      this.menu = visible
      this.openOnHover = !visible
    },
    cropPost() {
      this.isCropping = !this.isCropping
    },
    confirmCrop() {
      const canvas = this.$refs.clipper.clip()
      console.log(canvas.toDataURL())
      this.isCropping = false
    },
    cancelCrop() {
      this.isCropping = false
    },
  },
}
</script>

<style scoped>
.larger-container {
  width: 84vw;
}

.larger-actions {
  position: fixed;
  top: 16px;
  right: 16px;
  height: 40vh;
}
</style>
