<template>
  <div id="category">
    <container
      :gap="64"
      :columns="5"
      :is-loading="isSearching||isCaching"
      :is-show-footer-left-indicator="hasPrevPage"
      :is-show-footer-right-indicator="hasNextPage"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="prevTag"
      @footer-right-indicator-click="nextTag"
      @refresh-click="refreshCategory"
    >
      <template #header-action>
        <div>
          <v-text-field v-model="name" dense single-line rounded outlined></v-text-field>
        </div>
      </template>
      <template #content v-if="!isTagEmpty">
        <cover
          v-for="tag in tags"
          :key="tag.id"
          :size="194"
          :name="tag.name"
          :cover="categories[tag.name]"
          @cover-click="coverClick"
        ></cover>
      </template>
      <template #footer-title>
        <v-pagination v-model="pagination" :length="size" :disabled="isSearching||isCaching"></v-pagination>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import _ from 'lodash'
import { Container, Cover } from '../components/common'

const { mapGetters, mapActions } = createNamespacedHelpers('category')

export default {
  name: 'Category',
  components: {
    Container,
    Cover,
  },
  data() {
    return {
      pagination: 1,
      name: '',
      autoRefreshTimer: null,
      debouncedSearchTag: null,
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'size',
      'tags',
      'categories',
      'isSearching',
      'isTagEmpty',
      'hasPrevPage',
      'hasNextPage',
      'hasCached',
      'isCaching',
    ]),
  },
  watch: {
    pagination(newPagination) {
      this.loadTag(newPagination)
    },
    page(newPage) {
      this.pagination = newPage
    },
    name(newName) {
      this.debouncedSearchTag(newName)
    },
  },
  methods: {
    ...mapActions({
      loadTag: 'LOAD_TAG',
      prevTag: 'PREV_TAG',
      nextTag: 'NEXT_TAG',
      searchTag: 'SEARCH_TAG',
      refreshCategory: 'REFRESH_CATEGORY',
    }),
    coverClick(name) {
      this.$router.push({ name: 'tag', params: { name } })
    },
  },
  created() {
    this.loadTag()
    this.autoRefreshTimer = window.setInterval(
      () => this.refreshCategory(),
      10000,
    )
    this.debouncedSearchTag = _.debounce(search => this.searchTag(search), 1000)
  },
  destroyed() {
    window.clearInterval(this.autoRefreshTimer)
    this.debouncedSearchTag.cancel()
  },
}
</script>

<style lang="scss">
#category {
  .v-pagination li {
    &:first-child,
    &:last-child {
      display: none;
    }
  }
}
</style>