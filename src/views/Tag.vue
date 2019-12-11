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
        <v-chip label outlined>{{name}}</v-chip>
      </template>
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
      initState: 'INIT_STATE',
      loadTag: 'LOAD_TAG',
      prevTag: 'PREV_TAG',
      nextTag: 'NEXT_TAG',
      refreshTag: 'REFRESH_TAG',
    }),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initState()
      vm.loadTag({ name: to.params.name })
      vm.autoRefreshTimer = window.setInterval(() => vm.refreshTag(), 20000)
    })
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