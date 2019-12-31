<template>
  <div id="category">
    <container
      :gap="64"
      :columns="5"
      :is-loading="isSearching || isCaching"
      :is-show-footer-left-indicator="hasPrevPage"
      :is-show-footer-right-indicator="hasNextPage"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="prevTag"
      @footer-right-indicator-click="nextTag"
      @refresh-click="refreshCategory"
    >
      <template #header-action>
        <div class="d-inline-flex">
          <v-menu offset-y transition="scroll-y-transition" :disabled="isSearching">
            <template #activator="{on}">
              <v-btn
                class="mt-1"
                light
                outlined
                v-on="on"
                :disabled="isSearching"
                :color="tagType.color"
              >{{tagType.name}}</v-btn>
            </template>
            <template>
              <v-list>
                <v-list-item-group v-model="tagType" mandatory>
                  <v-list-item v-for="tagType in tagTypes" :key="tagType.value" :value="tagType">
                    <v-list-item-title :style="{color:tagType.color}">{{tagType.name}}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </template>
          </v-menu>
          <v-text-field class="ml-8" v-model="keyword" dense single-line rounded outlined></v-text-field>
        </div>
      </template>
      <template #content v-if="!isTagEmpty">
        <cover
          v-for="tag in tags"
          :key="tag.id"
          :width="194"
          :name="tag.name"
          :color="getTagColor(tag)"
          :cover="categories[tag.name]"
          @cover-clicked="clickCover"
        ></cover>
      </template>
      <template #footer-title>
        <v-pagination v-model="pagination" :length="size" :disabled="isSearching"></v-pagination>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import _ from 'lodash'
import { Container, Cover } from '../components'
import { tagTypes, getTagColor } from '../util/util'

const { mapGetters, mapActions } = createNamespacedHelpers('category')

export default {
  name: 'Category',
  components: {
    Container,
    Cover,
  },
  data() {
    return {
      tagTypes,
      tagType: {
        name: 'any',
        value: '',
        color: '#000000',
      },
      pagination: 1,
      keyword: '',
      autoRefreshTimer: null,
      debouncedSearchTag: null,
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'size',
      'name',
      'type',
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
    keyword(newKeyword) {
      this.debouncedSearchTag(newKeyword)
    },
    tagType(newTagType) {
      this.searchTag({ type: newTagType.value })
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
    getTagColor(tag) {
      return getTagColor(tag)
    },
    clickCover(name) {
      this.$router.push({ name: 'tag', params: { name } })
    },
  },
  created() {
    this.loadTag()
    this.autoRefreshTimer = window.setInterval(
      () => this.refreshCategory(),
      10000,
    )
    this.debouncedSearchTag = _.debounce(
      search => this.searchTag({ name: search }),
      1000,
    )
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