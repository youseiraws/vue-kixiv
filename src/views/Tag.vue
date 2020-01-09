<template>
  <div id="tag">
    <container
      :is-loading="isLoading"
      :is-show-header-left-indicator="true"
      :is-show-footer-left-indicator="hasPrevPage"
      :is-show-footer-right-indicator="hasNextPage"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="prevTag"
      @footer-right-indicator-click="nextTag"
      @refresh-click="refreshTag"
    >
      <template #header-title>
        <v-chip label outlined :color="color">
          {{name}}
          <span class="grey--text ml-2">{{count}}</span>
          <v-btn icon @click="selectTag()">
            <v-icon v-if="hasCollected" color="yellow">mdi-star</v-icon>
            <v-icon v-else>mdi-star-outline</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template #header-action>
        <v-menu offset-y transition="scroll-y-transition" :disabled="isLoading">
          <template #activator="{on}">
            <v-btn light outlined v-on="on" :disabled="isLoading">{{postOrder.name}}</v-btn>
          </template>
          <template>
            <v-list>
              <v-list-item-group v-model="postOrder" mandatory>
                <v-list-item
                  v-for="postOrder in postOrders"
                  :key="postOrder.value"
                  :value="postOrder"
                >
                  <v-list-item-title>{{postOrder.name}}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </template>
        </v-menu>
      </template>
      <template #content v-if="!isTagEmpty">
        <post
          v-for="post in tag"
          :key="post.id"
          :width="301"
          :post="post"
          @post-clicked="clickPost(post)"
        ></post>
      </template>
      <template #footer-title>
        <v-pagination v-model="pagination" :length="size" :disabled="isLoading"></v-pagination>
      </template>
    </container>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import { Container, Post } from '../components'
import { getTagColor } from '../util/util'

export default {
  name: 'Tag',
  components: {
    Container,
    Post,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      postTag: {},
      postOrders: [
        {
          name: '随机',
          value: 'random',
        },
        {
          name: '最新',
          value: 'latest',
        },
        {
          name: '热门',
          value: 'score',
        },
      ],
      postOrder: {
        name: '随机',
        value: 'random',
      },
      pagination: 1,
      autoRefreshTimer: null,
    }
  },
  computed: {
    ...mapGetters('tag', [
      'postTags',
      'page',
      'size',
      'order',
      'tag',
      'total',
      'isLoading',
      'isTagEmpty',
      'hasCached',
      'hasPrevPage',
      'hasNextPage',
    ]),
    ...mapGetters('category', ['totalTags']),
    ...mapGetters('collection', ['tagManagement']),
    count() {
      if (_.isEmpty(this.postTag)) return 0
      return this.postTag.count
    },
    color() {
      if (_.isEmpty(this.postTag)) return '#000000'
      return getTagColor(this.postTag)
    },
    hasCollected() {
      if (_.isEmpty(this.postTag)) return false
      return this.tagManagement.tags
        .map(tag => tag.id)
        .includes(this.postTag.id)
    },
  },
  watch: {
    postTags(newPostTags) {
      this.postTag = newPostTags.find(tag => tag.name === this.name)
    },
    total(newTotal) {
      this.setPosts(newTotal)
    },
    pagination(newPagination) {
      this.loadTag({ page: newPagination })
    },
    page(newPage) {
      this.pagination = newPage
    },
    postOrder(newPostOrder) {
      this.sortTag(newPostOrder.value)
    },
  },
  methods: {
    ...mapActions('tag', {
      initState: 'INIT_STATE',
      searchPostTag: 'SEARCH_POST_TAG',
      loadTag: 'LOAD_TAG',
      prevTag: 'PREV_TAG',
      nextTag: 'NEXT_TAG',
      sortTag: 'SORT_TAG',
      refreshTag: 'REFRESH_TAG',
    }),
    ...mapMutations('larger', { setPosts: 'SET_POSTS' }),
    ...mapActions('larger', { openLarger: 'OPEN_LARGER' }),
    ...mapActions('collection', {
      collectionTag: 'TAG',
      collectionUntag: 'UNTAG',
    }),
    initTag(name) {
      const tag = [...this.totalTags.flat(), ...this.postTags].find(
        tag => tag.name === name,
      )
      if (tag !== undefined) this.postTag = tag
      else this.searchPostTag(name)
    },
    clickPost(post) {
      this.openLarger({ post, posts: this.total, loadMore: this.nextTag })
    },
    selectTag() {
      if (this.hasCollected) this.collectionUntag(this.postTag.id)
      else this.collectionTag(this.postTag.id)
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initState()
      vm.pagination = vm.page
      vm.postOrder = vm.postOrders.find(
        postOrder => postOrder.value === vm.order,
      )
      vm.initTag(to.params.name)
      vm.loadTag({ name: to.params.name })
      vm.autoRefreshTimer = window.setInterval(() => vm.refreshTag(), 20000)
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.initState()
    this.pagination = this.page
    this.postOrder = this.postOrders.find(
      postOrder => postOrder.value === this.order,
    )
    this.initTag(to.params.name)
    this.loadTag({ name: to.params.name })
    next()
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.autoRefreshTimer)
    next()
  },
}
</script>

<style lang="scss">
#tag {
  .v-pagination li {
    &:first-child,
    &:last-child {
      display: none;
    }
  }
}
</style>