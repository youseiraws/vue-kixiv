<template>
  <div id="tag">
    <v-hover #default="{hover}">
      <v-card :raised="hover" class="tag-card">
        <v-img
          :width="size"
          :aspect-ratio="1"
          :src="getPostUrl(cover,'sample')"
          :lazy-src="getPostUrl(cover,'preview')"
        >
          <v-overlay absolute>{{name}}</v-overlay>
        </v-img>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { getPostUrl } from '../../util/util'

export default {
  name: 'Tag',
  props: {
    size: {
      type: Number,
    },
    name: {
      type: String,
      default: '',
    },
    cover: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    getPostUrl(post, postType) {
      return getPostUrl(post, postType)
    },
  },
}
</script>

<style>
.tag-card {
  cursor: pointer;
  user-select: none;
  border-radius: 50% !important;
}
</style>