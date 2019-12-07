<template>
  <div id="random">
    <container
      :is-loading="isLoading"
      :is-show-left-indicator="hasPrevPage"
      :is-show-right-indicator="hasNextPage"
      @footer-left-indicator-click="prevRandom"
      @footer-right-indicator-click="nextRandom"
      @refresh-click="refreshRandom"
    >
      <template #header-title>
        <div>
          <v-autocomplete
            v-model="select"
            :items="items"
            multiple
            dense
            small-chips
            single-line
            hide-no-data
            deletable-chips
            hide-selected
            rounded
            outlined
          ></v-autocomplete>
        </div>
      </template>
      <template #content v-if="!isRandomEmpty">
        <post v-for="post in random" :key="post.id" :post="post" :posts="random"></post>
      </template>
      <template #footer-title>
        <v-pagination v-model="pagination" :length="size" :total-visible="20" :disabled="isLoading"></v-pagination>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
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
      select: [],
      items: ['Programming', 'Design', 'Vue', 'Vuetify'],
    }
  },
  computed: {
    ...mapGetters([
      'page',
      'size',
      'random',
      'isLoading',
      'isRandomEmpty',
      'hasPrevPage',
      'hasNextPage',
    ]),
  },
  watch: {
    pagination(newPagination) {
      this.loadRandom(newPagination)
    },
    page(newPage) {
      this.pagination = newPage
    },
  },
  methods: {
    ...mapActions({
      loadRandom: 'LOAD_RANDOM',
      prevRandom: 'PREV_RANDOM',
      nextRandom: 'NEXT_RANDOM',
      refreshRandom: 'REFRESH_RANDOM',
    }),
  },
  created() {
    this.pagination = this.page
    this.loadRandom()
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