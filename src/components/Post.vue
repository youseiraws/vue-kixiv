<template>
  <div id="post" v-if="!hasBlacked">
    <v-hover #default="{hover}">
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
          <v-card
            v-on="on"
            outlined
            :raised="hover"
            @click="openLarger({post,posts,loadMore})"
            @contextmenu.prevent
          >
            <v-img
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
              <info-row text="评分" :value="score"></info-row>
              <info-row text="评级" :value="rating"></info-row>
              <info-row text="图片尺寸" :value="resolution"></info-row>
              <info-row text="图片大小" :value="size"></info-row>
              <info-row text="作者" :value="author"></info-row>
              <info-row text="上传日期" :value="uploadDate"></info-row>
            </v-card-text>
            <v-card-actions>
              <v-btn icon @click="showCollections()">
                <v-icon v-if="hasCollected" color="red">mdi-heart</v-icon>
                <v-icon v-else>mdi-heart-outline</v-icon>
              </v-btn>
              <v-btn v-if="hasBlacked" icon @click="unblack(post.id)">
                <v-icon>mdi-minus-circle</v-icon>
              </v-btn>
              <v-btn v-else icon @click="black(post.id)">
                <v-icon>mdi-minus-circle-outline</v-icon>
              </v-btn>
              <v-btn v-show="couldDownload" icon @click="download()">
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon @click="showTags()">
                <v-icon>mdi-tag-outline</v-icon>
              </v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div>
                <div v-show="isCollectionsShow">
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-hover
                      #default="{hover}"
                      v-for="(collection,index) in collections"
                      :key="collection.name"
                    >
                      <v-list-item v-if="editCollectionSwitchs[index]">
                        <v-text-field
                          v-model="editedCollection"
                          dense
                          solo
                          single-line
                          autofocus
                          append-outer-icon="mdi-check-circle-outline"
                          @click:append-outer="editCollection(collection,index)"
                          @keyup.enter="editCollection(collection,index)"
                        ></v-text-field>
                      </v-list-item>
                      <v-list-item v-else @click="selectCollection(collection)">
                        <v-list-item-icon>
                          <v-icon
                            v-if="collection.posts.map(post=>post.id).includes(post.id)"
                            color="yellow"
                          >mdi-star</v-icon>
                          <v-icon v-else>mdi-star-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          {{collection.name}}
                          <span
                            class="grey--text pl-1"
                          >{{collection.posts.length}}</span>
                        </v-list-item-title>
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          v-show="collection.name!=='默认收藏集'&&hover"
                          @click.stop="switchEditCollection(collection,index)"
                        >
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          v-show="collection.name!=='默认收藏集'&&hover"
                          @click.stop="confirmRemoveCollection(collection)"
                        >
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </v-list-item>
                    </v-hover>
                    <v-list-item v-if="addCollectionSwitch">
                      <v-text-field
                        v-model="addedCollection"
                        dense
                        solo
                        single-line
                        autofocus
                        append-outer-icon="mdi-check-circle-outline"
                        @click:append-outer="addCollection()"
                        @keyup.enter="addCollection()"
                      ></v-text-field>
                    </v-list-item>
                    <v-list-item v-else @click="switchAddCollection()">
                      <v-list-item-icon>
                        <v-icon>mdi-book-plus</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>新建收藏集</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
                <div v-show="isTagsShow">
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-chip-group column dark active-class="white">
                      <v-chip
                        v-for="tag in post.storage.tags"
                        :key="tag.id"
                        small
                        :color="getTagColor(tag)"
                        @click="chipClick(tag.name)"
                      >{{tag.name}}</v-chip>
                    </v-chip-group>
                  </v-card-text>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </template>
      </v-menu>
    </v-hover>
    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-card-title>
          <span>确定删除</span>
          <span class="red--text">{{removedCollection.name}}</span>
          <span>收藏集吗？</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">取消</v-btn>
          <v-btn text @click="removeCollection()">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import {
  getTagColor,
  getPostUrl,
  capitalToRating,
  downloadImage,
} from '../util/util'
import InfoRow from './InfoRow'

const dateDisplayFormat = 'YYYY年MM月DD日'

export default {
  name: 'Post',
  components: {
    InfoRow,
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
      addCollectionSwitch: false,
      editCollectionSwitchs: [],
      addedCollection: '',
      editedCollection: '',
      dialog: false,
      removedCollection: {},
      isTagsShow: false,
    }
  },
  computed: {
    ...mapGetters('collection', ['collections', 'blacklist']),
    score() {
      return this.post.score.toString()
    },
    rating() {
      return capitalToRating(this.post.rating)
    },
    resolution() {
      return `${this.post.width} x ${this.post.height}`
    },
    size() {
      return this.post.file_size / 1024 < 1024
        ? `${(this.post.file_size / 1024).toFixed(2)} KB`
        : `${(this.post.file_size / 1024 ** 2).toFixed(2)} MB`
    },
    author() {
      const authorTag = this.post.storage.tags.find(tag => tag.type === 1)
      if (authorTag !== undefined) return authorTag.name
      else return ''
    },
    uploadDate() {
      return moment
        .unix(this.post.created_at)
        .utc()
        .format(dateDisplayFormat)
    },
    hasCollected() {
      return this.collections.some(collection =>
        collection.posts.map(post => post.id).includes(this.post.id),
      )
    },
    hasBlacked() {
      return this.blacklist.posts.map(post => post.id).includes(this.post.id)
    },
    couldDownload() {
      return this.post.storage.file_url !== undefined
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
        this.addCollectionSwitch = false
      }
    },
    collections(newCollections) {
      this.editCollectionSwitchs = new Array(newCollections.length).fill(false)
    },
  },
  methods: {
    ...mapMutations('larger', { setPosts: 'SET_POSTS' }),
    ...mapActions('larger', { openLarger: 'OPEN_LARGER' }),
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
    getTagColor(tag) {
      return getTagColor(tag)
    },
    getPostUrl(post, postType) {
      return getPostUrl(post, postType)
    },
    chipClick(name) {
      this.menu = false
      this.$router.push({ name: 'tag', params: { name } })
    },
    showCollections() {
      this.isTagsShow = false
      this.isCollectionsShow = !this.isCollectionsShow
    },
    selectCollection(collection) {
      if (collection.posts.map(post => post.id).includes(this.post.id))
        this.dislike({ name: collection.name, id: this.post.id })
      else this.like({ name: collection.name, id: this.post.id })
    },
    switchAddCollection() {
      this.addCollectionSwitch = true
    },
    addCollection() {
      this.addCollectionSwitch = false
      this.add(this.addedCollection)
      this.addedCollection = ''
    },
    switchEditCollection(collection, index) {
      this.editedCollection = collection.name
      this.editCollectionSwitchs.splice(index, 1, true)
    },
    editCollection(collection, index) {
      this.editCollectionSwitchs.splice(index, 1, false)
      this.edit({ oldName: collection.name, newName: this.editedCollection })
    },
    confirmRemoveCollection(collection) {
      this.menu = false
      this.removedCollection = collection
      this.dialog = true
    },
    removeCollection() {
      this.remove(this.removedCollection.name)
      this.dialog = false
    },
    showTags() {
      this.isCollectionsShow = false
      this.isTagsShow = !this.isTagsShow
    },
    download() {
      if (this.post.storage.file_url === undefined) return
      downloadImage(this.post.storage.file_url)
    },
  },
  created() {
    this.editCollectionSwitchs = new Array(this.collections.length).fill(false)
  },
}
</script>

<style>
</style>
