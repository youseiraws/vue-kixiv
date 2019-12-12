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
          <v-menu offset-y transition="scroll-y-transition" :disabled="isLoading">
            <template v-slot:activator="{on}">
              <v-btn text x-large v-on="on" :disabled="isLoading"></v-btn>
            </template>
            <template>
              <v-list flat>
                <v-list-item-group v-model="tagType" mandatory>
                  <v-list-item
                    v-for="tagType in tagTypes"
                    :key="tagType.value"
                    :value="tagType.value"
                    :color="tagType.color"
                  >
                    <v-list-item-title>{{tagType.name}}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </template>
          </v-menu>
          <v-text-field v-model="keyword" dense single-line rounded outlined></v-text-field>
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
      tagTypes: [
        {
          name: 'any',
          value: '',
          color: '#000000',
        },
        {
          name: 'general',
          value: 0,
          color: '#ffaaae',
        },
        {
          name: 'artist',
          value: 1,
          color: '#cccc00',
        },
        {
          name: 'copyright',
          value: 3,
          color: '#dd00dd',
        },
        {
          name: 'character',
          value: 4,
          color: '#00aa00',
        },
        {
          name: 'style',
          value: 5,
          color: '#ff2020',
        },
        {
          name: 'circle',
          value: 6,
          color: '#00bbbb',
        },
      ],
      tagType: '',
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
      this.searchTag({ type: newTagType })
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
    this.debouncedSearchTag = _.debounce(
      search => this.searchTag({ name: search }),
      1000,
    )
  },
  destroyed() {
    window.clearInterval(this.autoRefreshTimer)
    this.debouncedSearchTag.cancel()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.keyword = vm.name
      vm.tagType = vm.type
    })
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