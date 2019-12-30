<template>
  <div id="post-black-btn">
    <v-btn v-if="hasBlacked" icon @click="unblack(post.id)">
      <v-icon>mdi-minus-circle</v-icon>
    </v-btn>
    <v-btn v-else icon @click="black(post.id)">
      <v-icon>mdi-minus-circle-outline</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters, mapActions } = createNamespacedHelpers('collection')

export default {
  name: 'PostBlackBtn',
  props: {
    post: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    ...mapGetters(['blacklist']),
    hasBlacked() {
      return this.blacklist.posts.map(post => post.id).includes(this.post.id)
    },
  },
  methods: {
    ...mapActions({
      black: 'BLACK',
      unblack: 'UNBLACK',
    }),
  },
}
</script>

<style>
</style>