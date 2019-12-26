<template>
  <div id="random">
    <container
      :is-loading="isLoading"
      :is-show-footer-left-indicator="hasPrevPage"
      :is-show-footer-right-indicator="hasNextPage"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="prevRandom"
      @footer-right-indicator-click="nextRandom"
      @refresh-click="refreshRandom"
    >
      <template #header-action>
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
            <template #selection="{attrs,on,item,selected,select}">
              <v-chip
                dark
                label
                small
                close
                v-bind="attrs"
                v-on="on"
                :color="getTagColor(item)"
                :input-value="selected"
                @click="select"
                @click:close="removeItem(item)"
              >{{item.name}}</v-chip>
            </template>
            <template #item="{item}">
              <v-list-item-title :style="{color:getTagColor(item)}">{{item.name}}</v-list-item-title>
            </template>
          </v-autocomplete>
        </div>
      </template>
      <template #content v-if="!isRandomEmpty">
        <post
          v-for="post in random"
          :key="post.id"
          :width="301"
          :post="post"
          :posts="total"
          :load-more="nextRandom"
        ></post>
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
import { Container, Post } from '../components'
import { tagTypes, getTagColor } from '../util/util'

const { mapGetters, mapActions } = createNamespacedHelpers('random')

export default {
  name: 'Random',
  components: {
    Container,
    Post,
  },
  data() {
    return {
      tagTypes,
      pagination: 1,
      autoRefreshTimer: null,
      search: null,
      select: [],
      debouncedSearchTag: null,
      debouncedSearchRandom: null,
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'size',
      'random',
      'total',
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
    getTagColor(tag) {
      return getTagColor(tag)
    },
    removeItem(item) {
      this.select = this.select.filter(sel => !_.isEqual(sel, item))
    },
  },
  created() {
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