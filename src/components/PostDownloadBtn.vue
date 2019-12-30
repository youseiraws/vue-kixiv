<template>
  <div id="post-download-btn">
    <v-btn v-show="couldDownload" icon @click="download()">
      <v-icon>mdi-download</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { downloadImage } from '../util/util'

export default {
  name: 'PostDownloadBtn',
  props: {
    post: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    couldDownload() {
      return this.post.storage.file_url !== undefined
    },
  },
  methods: {
    download() {
      if (this.post.storage.file_url === undefined) return
      downloadImage(this.post.storage.file_url)
    },
  },
}
</script>

<style>
</style>