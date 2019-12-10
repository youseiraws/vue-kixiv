<template>
  <div id="category">
    <container
      :gap="64"
      :columns="5"
      :is-loading="isSearching||isCaching"
      :is-show-left-indicator="hasPrevPage"
      :is-show-right-indicator="hasNextPage"
      :is-show-refresh="true"
      @footer-left-indicator-click="prevTag"
      @footer-right-indicator-click="nextTag"
      @refresh-click="refreshCategory"
    >
      <template #content v-if="!isTagEmpty">
        <tag
          v-for="tag in tags"
          :key="tag.id"
          :size="194"
          :name="tag.name"
          :cover="categories[tag.name]"
        ></tag>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { Container, Tag } from '../components/common'

const { mapGetters, mapActions } = createNamespacedHelpers('category')

export default {
  name: 'Category',
  components: {
    Container,
    Tag,
  },
  data() {
    return {
      autoRefreshTimer: null,
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
  methods: {
    ...mapActions({
      loadTag: 'LOAD_TAG',
      prevTag: 'PREV_TAG',
      nextTag: 'NEXT_TAG',
      searchTag: 'SEARCH_TAG',
      refreshCategory: 'REFRESH_CATEGORY',
    }),
  },
  created() {
    this.loadTag()
    this.autoRefreshTimer = window.setInterval(
      () => this.refreshCategory(),
      10000,
    )
  },
  destroyed() {
    window.clearInterval(this.autoRefreshTimer)
  },
}
</script>

<style scoped>
</style>