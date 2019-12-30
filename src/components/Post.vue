<template>
  <div id="post" v-if="!hasBlacked">
    <v-menu
      v-model="menu"
      offset-x
      open-on-hover
      :close-on-content-click="false"
      :open-delay="500"
      :close-delay="500"
      :min-width="300"
      :nudge-right="6"
      transition="scroll-x-transition"
    >
      <template #activator="{on}">
        <v-card v-on="on" outlined @click="openLarger({post,posts,loadMore})" @contextmenu.prevent>
          <v-img
            :contain="contain"
            :width="width"
            :aspect-ratio="16/9"
            :src="getPostUrl(post,'sample')"
            :lazy-src="getPostUrl(post,'preview')"
          ></v-img>
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
              <div v-show="isCollectionsShow">
                <v-divider></v-divider>
                <post-collection :post="post"></post-collection>
              </div>
              <div v-show="isTagsShow">
                <v-divider></v-divider>
                <post-tag :post="post"></post-tag>
              </div>
            </div>
          </v-expand-transition>
        </v-card>
      </template>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getTagColor, getPostUrl } from '../util/util'
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
    width: {
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
  data() {
    return {
      menu: false,
      isCollectionsShow: false,
      isTagsShow: false,
    }
  },
  computed: {
    ...mapGetters('collection', ['collections', 'blacklist']),
    ...mapGetters('setting', ['contain']),
    hasCollected() {
      return this.collections.some(collection =>
        collection.posts.map(post => post.id).includes(this.post.id),
      )
    },
    hasBlacked() {
      return this.blacklist.posts.map(post => post.id).includes(this.post.id)
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
    menu(newMenu) {
      if (newMenu === false) {
        this.isTagsShow = false
        this.isCollectionsShow = false
      }
    },
  },
  methods: {
    ...mapMutations('larger', { setPosts: 'SET_POSTS' }),
    ...mapActions('larger', { openLarger: 'OPEN_LARGER' }),
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
  },
}
</script>

<style>
</style>
