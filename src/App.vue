<template>
  <v-app id="app">
    <home></home>
    <larger></larger>
    <tooltip></tooltip>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import { Home, Larger, Tooltip } from './views'

export default {
  name: 'App',
  components: { Home, Larger, Tooltip },
  methods: {
    ...mapActions('collection', {
      collections: 'LIST',
    }),
    ...mapActions('setting', {
      settings: 'LIST',
    }),
  },
  created() {
    this.collections()
    this.settings()
  },
}
</script>

<style>
@import 'assets/css/base.css';
</style>
