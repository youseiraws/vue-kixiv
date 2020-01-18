<template>
  <div id="post-download-btn">
    <v-btn v-show="couldDownload" :large="large" icon @click="download()">
      <v-icon>mdi-download</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { downloadImage } from '../util/util'

export default {
  name: 'PostDownloadBtn',
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
    couldDownload() {
      return (
        this.post.storage.crop_url !== undefined ||
        this.post.storage.file_url !== undefined
      )
    },
  },
  methods: {
    download() {
      downloadImage(this.post.storage.crop_url || this.post.storage.file_url)
    },
  },
}
</script>

<style>
</style>