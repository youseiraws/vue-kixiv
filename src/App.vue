<template>
  <v-app id="app">
    <home></home>
    <larger></larger>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import { Home, Larger } from './views'

export default {
  name: 'App',
  components: { Home, Larger },
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
