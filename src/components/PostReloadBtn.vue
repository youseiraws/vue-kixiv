<template>
  <div id="post-reload-btn">
    <v-btn icon :loading="isReloading" :disabled="isReloading" :large="large" @click="reloadPost()">
      <v-icon>mdi-reload</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters, mapActions } = createNamespacedHelpers('post')

export default {
  name: 'PostReloadBtn',
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
    postTypes: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      isReloading: false,
    }
  },
  methods: {
    ...mapActions({
      reload: 'RELOAD',
    }),
    async reloadPost() {
      this.isReloading = true
      await this.reload({ id: this.post.id, postTypes: this.postTypes })
      this.isReloading = false
    },
  },
}
</script>

<style>
</style>