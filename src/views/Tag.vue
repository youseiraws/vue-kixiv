<template>
  <div id="tag">
    <container
      :is-loading="isLoading"
      :is-show-left-indicator="hasPrevPage"
      :is-show-right-indicator="hasNextPage"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="prevTag"
      @footer-right-indicator-click="nextTag"
      @refresh-click="refreshTag"
    >
      <template #content v-if="!isTagEmpty">
        <post v-for="post in tag" :key="post.id" :size="301" :post="post" :posts="tag"></post>
      </template>
      <template #footer-title>
        <v-pagination v-model="pagination" :length="size" :disabled="isLoading"></v-pagination>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import _ from 'lodash'
import { Container, Post } from '../components/common'

const { mapGetters, mapActions } = createNamespacedHelpers('tag')

export default {
  name: 'Tag',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  components: {
    Container,
    Post,
  },
  data() {
    return {
      pagination: 1,
      autoRefreshTimer: null,
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'size',
      'tag',
      'isLoading',
      'isTagEmpty',
      'hasCached',
      'hasPrevPage',
      'hasNextPage',
    ]),
  },
  watch: {
    pagination(newPagination) {
      this.loadTag({ page: newPagination })
    },
    page(newPage) {
      this.pagination = newPage
    },
  },
  methods: {
    ...mapActions({
      loadTag: 'LOAD_TAG',
      prevTag: 'PREV_TAG',
      nextTag: 'NEXT_TAG',
      refreshTag: 'REFRESH_TAG',
    }),
  },
  created() {
    this.pagination = this.page
    this.loadTag({ name: this.name })
    this.autoRefreshTimer = window.setInterval(() => this.refreshTag(), 20000)
  },
  destroyed() {
    window.clearInterval(this.autoRefreshTimer)
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