<template>
  <div id="cover">
    <v-hover #default="{hover}">
      <v-card class="cover-card" :raised="hover" v-on="$listeners">
        <v-img
          class="cover-img"
          :width="width"
          :aspect-ratio="1"
          :src="getPostUrl(cover,'sample')"
          :lazy-src="getPostUrl(cover,'preview')"
        >
          <v-overlay absolute class="text-center">
            <div :style="{color:color}">{{name}}</div>
            <div class="white--text">{{count}}</div>
          </v-overlay>
        </v-img>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
import { getPostUrl } from '../util/util'

export default {
  name: 'Cover',
  props: {
    width: {
      type: Number,
    },
    name: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#000000',
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

<style scoped>
.cover-card {
  cursor: pointer;
  user-select: none;
  border-radius: 50% !important;
}

.cover-img {
  border-radius: 50% !important;
}
</style>