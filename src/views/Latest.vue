<template>
  <div id="latest">
    <container
      :is-loading="isLoading"
      :is-show-left-indicator="hasNextDaily"
      @left-indicator-click="nextDaily"
      @right-indicator-click="prevDaily"
    >
      <template #title>{{date}}</template>
      <post v-for="post in daily" :key="post.id" :post="post" :posts="daily"></post>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { Container, Post } from '../components/common'

const { mapGetters, mapActions } = createNamespacedHelpers('latest')

export default {
  name: 'Latest',
  components: {
    Container,
    Post,
  },
  computed: {
    ...mapGetters([
      'date',
      'daily',
      'isLoading',
      'isDailyEmpty',
      'isLatestEmpty',
      'hasNextDaily',
    ]),
  },
  methods: {
    ...mapActions({
      loadDaily: 'LOAD_DAILY',
      prevDaily: 'PREV_DAILY',
      nextDaily: 'NEXT_DAILY',
    }),
  },
  created() {
    this.loadDaily()
  },
}
</script>

<style scoped>
</style>
