<template>
  <div id="larger">
    <v-overlay :value="overlay">
      <v-hover #default="{hover}">
        <div>
          <v-card v-if="isCropping" class="larger-container d-flex align-center">
            <clipper-basic
              class="mx-auto"
              ref="clipper"
              :style="clipperBasicStyle"
              :src="clipperBasicSrc"
              :ratio="16/9"
              :init-width="100"
              :init-height="100"
            ></clipper-basic>
          </v-card>
          <v-carousel
            v-else
            class="larger-container"
            v-model="indexModel"
            :cycle="!hover&&cycle&&!isLocked"
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
          <v-item-group
            class="larger-actions actions-left d-flex flex-column justify-space-between"
          >
            <v-item class="larger-item">
              <div>
                <v-btn icon large @click="isLocked=!isLocked">
                  <v-icon v-if="isLocked">mdi-lock-outline</v-icon>
                  <v-icon v-else>mdi-lock-open-outline</v-icon>
                </v-btn>
              </div>
            </v-item>
            <v-spacer></v-spacer>
          </v-item-group>
          <v-item-group
            class="larger-actions actions-right d-flex flex-column justify-space-between"
          >
            <v-item class="larger-item">
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
            <v-item class="larger-item">
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
            <v-item class="larger-item">
              <post-black-btn :post="currentPost" large @post-blacked="closeLarger()"></post-black-btn>
            </v-item>
            <v-item class="larger-item">
              <post-download-btn :post="currentPost" large></post-download-btn>
            </v-item>
            <v-item class="larger-item">
              <div>
                <v-btn icon large @click="cropPost()">
                  <v-icon>mdi-crop</v-icon>
                </v-btn>
              </div>
            </v-item>
            <v-item v-show="couldCrop" class="larger-item">
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
            <v-item v-show="isCropping" class="larger-item">
              <div>
                <v-btn icon large @click="confirmCrop()">
                  <v-icon color="green">mdi-check-circle</v-icon>
                </v-btn>
              </div>
            </v-item>
            <v-item v-show="isCropping" class="larger-item">
              <div>
                <v-btn icon light large @click="cancelCrop()">
                  <v-icon color="red">mdi-close-circle</v-icon>
                </v-btn>
              </div>
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
import { getPostUrl, imageToBase64 } from '../util/util'
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
      clipperBasicSrc: '',
      isLocked: false,
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
    couldCrop() {
      return this.currentPost.storage.file_url !== undefined
    },
    clipperBasicStyle() {
      if (this.currentPost.width / this.currentPost.height > 16 / 9)
        return {
          height: `${(this.currentPost.height / this.currentPost.width) *
            1290}px`,
        }
      else
        return {
          width: `${(this.currentPost.width / this.currentPost.height) *
            726}px`,
        }
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
    async currentPost(newCurrentPost) {
      if (
        newCurrentPost === undefined ||
        newCurrentPost.storage.file_url === undefined
      ) {
        this.clipperBasicSrc = ''
        return
      }
      const base64 = await imageToBase64(newCurrentPost.storage.file_url)
      const ext = newCurrentPost.storage.file_url
        .split('.')
        .reverse()[0]
        .toLowerCase()
      this.clipperBasicSrc = `data:image/${ext};base64,${base64}`
    },
  },
  methods: {
    ...mapActions('post', { crop: 'CROP' }),
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
    async confirmCrop() {
      const canvas = this.$refs.clipper.clip()
      await this.crop({
        post: this.currentPost,
        crop: canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ''),
      })
      this.isCropping = false
    },
    cancelCrop() {
      this.isCropping = false
    },
  },
}
</script>

<style lang="scss">
#larger {
  .vertical.clip-area .img {
    width: 100% !important;
  }
  .larger-container {
    width: 84vw;
    height: 97vh;
  }

  .larger-actions {
    position: fixed;
    top: 16px;
    height: 90vh;
  }
  .actions-left {
    left: 16px;
  }
  .actions-right {
    right: 16px;
  }
  .larger-item {
    margin: 6px 0;
  }
}
</style>
