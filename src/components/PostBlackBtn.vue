<template>
  <div id="post-black-btn">
    <v-btn v-if="hasBlacked" icon :large="large" @click="unblack(post.id)">
      <v-icon>mdi-minus-circle</v-icon>
    </v-btn>
    <v-btn v-else icon :large="large" @click="blackPost(post.id)">
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
    large: {
      type: Boolean,
      default: false,
    },
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
    blackPost(id) {
      this.$emit('post-blacked')
      this.black(id)
    },
  },
}
</script>

<style>
</style>