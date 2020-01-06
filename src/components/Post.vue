<template>
  <div id="post" v-if="(!hasBlacked||showBlacked)&&!hasRatingLimited">
    <v-menu
      v-model="menu"
      offset-x
      :open-on-hover="openOnHover"
      :close-on-content-click="false"
      :open-delay="500"
      :close-delay="500"
      :min-width="300"
      :nudge-right="6"
      :disabled="disabled"
      transition="scroll-x-transition"
    >
      <template #activator="{on}">
        <v-card v-on="on" outlined @click="$emit('post-clicked')" @contextmenu.prevent>
          <v-img
            :contain="contain"
            :width="width"
            :aspect-ratio="16/9"
            :src="getPostUrl(post,'sample')"
            :lazy-src="getPostUrl(post,'preview')"
          >
            <slot name="action">
              <v-icon v-if="hasCollected" class="post-heart-icon pa-1" color="red">mdi-heart</v-icon>
            </slot>
          </v-img>
        </v-card>
      </template>
      <template>
        <v-card outlined :width="300">
          <v-card-text>
            <post-info :post="post"></post-info>
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="showCollections()">
              <v-icon v-if="hasCollected" color="red">mdi-heart</v-icon>
              <v-icon v-else>mdi-heart-outline</v-icon>
            </v-btn>
            <post-black-btn :post="post"></post-black-btn>
            <post-download-btn :post="post"></post-download-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="showTags()">
              <v-icon>mdi-tag-outline</v-icon>
            </v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div>
              <div v-if="isCollectionsShow">
                <v-divider></v-divider>
                <post-collection
                  :post="post"
                  @dialog-opened="setVisibility(true)"
                  @dialog-closed="setVisibility(false)"
                ></post-collection>
              </div>
              <div v-if="isTagsShow">
                <v-divider></v-divider>
                <v-card-text>
                  <post-tag :post="post"></post-tag>
                </v-card-text>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </template>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPostUrl } from '../util/util'
import PostInfo from './PostInfo'
import PostCollection from './PostCollection'
import PostBlackBtn from './PostBlackBtn'
import PostDownloadBtn from './PostDownloadBtn'
import PostTag from './PostTag'

export default {
  name: 'Post',
  components: {
    PostInfo,
    PostCollection,
    PostBlackBtn,
    PostDownloadBtn,
    PostTag,
  },
  props: {
    showBlacked: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    post: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      menu: false,
      openOnHover: true,
      isCollectionsShow: false,
      isTagsShow: false,
    }
  },
  computed: {
    ...mapGetters('collection', ['collections', 'blacklist']),
    ...mapGetters('setting', ['contain', 'rating']),
    hasCollected() {
      return this.collections.some(collection =>
        collection.posts.map(post => post.id).includes(this.post.id),
      )
    },
    hasBlacked() {
      return this.blacklist.posts.map(post => post.id).includes(this.post.id)
    },
    hasRatingLimited() {
      return !this.rating.includes(this.post.rating)
    },
  },
  watch: {
    menu(newMenu) {
      if (newMenu === false) {
        this.isTagsShow = false
        this.isCollectionsShow = false
      }
    },
  },
  methods: {
    getPostUrl(post, postType) {
      return getPostUrl(post, postType)
    },
    showCollections() {
      this.isTagsShow = false
      this.isCollectionsShow = !this.isCollectionsShow
    },
    showTags() {
      this.isCollectionsShow = false
      this.isTagsShow = !this.isTagsShow
    },
    setVisibility(visible) {
      this.menu = visible
      this.openOnHover = !visible
    },
  },
}
</script>

<style scoped>
.post-heart-icon {
  width: 100%;
  height: 100%;
  justify-content: flex-end !important;
  align-items: flex-end !important;
}
</style>
