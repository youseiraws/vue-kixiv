<template>
  <div id="random">
    <container
      :is-loading="isLoading"
      :is-show-left-indicator="hasPrevPage"
      :is-show-right-indicator="hasNextPage"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="prevRandom"
      @footer-right-indicator-click="nextRandom"
      @refresh-click="refreshRandom"
    >
      <template #header-title>
        <div>
          <v-autocomplete
            v-model="select"
            :loading="isSearching"
            :items="items"
            :search-input.sync="search"
            item-text="name"
            dense
            multiple
            small-chips
            single-line
            hide-no-data
            deletable-chips
            hide-selected
            rounded
            outlined
            return-object
          >
            <template #append>
              <span></span>
            </template>
          </v-autocomplete>
        </div>
      </template>
      <template #content v-if="!isRandomEmpty">
        <post v-for="post in random" :key="post.id" :size="301" :post="post" :posts="random"></post>
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

const { mapGetters, mapActions } = createNamespacedHelpers('random')

export default {
  name: 'Random',
  components: {
    Container,
    Post,
  },
  data() {
    return {
      pagination: 1,
      autoRefreshTimer: null,
      search: null,
      select: null,
      debouncedSearchTag: null,
      debouncedSearchRandom: null,
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'size',
      'random',
      'isLoading',
      'isRandomEmpty',
      'hasCached',
      'hasPrevPage',
      'hasNextPage',
      'items',
      'isSearching',
    ]),
  },
  watch: {
    pagination(newPagination) {
      this.loadRandom(newPagination)
    },
    page(newPage) {
      this.pagination = newPage
    },
    search(newSearch) {
      this.debouncedSearchTag(newSearch)
    },
    select(newSelect) {
      this.debouncedSearchRandom(newSelect)
    },
  },
  methods: {
    ...mapActions({
      loadRandom: 'LOAD_RANDOM',
      prevRandom: 'PREV_RANDOM',
      nextRandom: 'NEXT_RANDOM',
      searchRandom: 'SEARCH_RANDOM',
      refreshRandom: 'REFRESH_RANDOM',
      searchTag: 'SEARCH_TAG',
    }),
  },
  created() {
    this.pagination = this.page
    this.loadRandom()
    this.autoRefreshTimer = window.setInterval(
      () => this.refreshRandom(),
      20000,
    )
    this.debouncedSearchTag = _.debounce(search => this.searchTag(search), 1000)
    this.debouncedSearchRandom = _.debounce(
      select => this.searchRandom(select),
      1000,
    )
  },
  destroyed() {
    window.clearInterval(this.autoRefreshTimer)
    this.debouncedSearchTag.cancel()
    this.debouncedSearchRandom.cancel()
  },
}
</script>

<style lang="scss">
#random {
  .v-pagination li {
    &:first-child,
    &:last-child {
      display: none;
    }
  }
}
</style>