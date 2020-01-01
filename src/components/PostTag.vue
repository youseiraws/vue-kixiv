<template>
  <div id="post-tag">
    <v-chip-group column dark active-class="white">
      <v-chip
        v-for="tag in post.storage.tags"
        :key="tag.id"
        small
        :color="getTagColor(tag)"
        @click="clickTag(tag.name)"
      >{{tag.name}}</v-chip>
    </v-chip-group>
  </div>
</template>

<script>
import { getTagColor } from '../util/util'

export default {
  name: 'PostTag',
  props: {
    post: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    getTagColor(tag) {
      return getTagColor(tag)
    },
    clickTag(name) {
      this.$emit('tag-clicked')
      this.$router.push({ name: 'tag', params: { name } })
    },
  },
}
</script>

<style>
</style>