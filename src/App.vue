<template>
  <v-app id="app">
    <random></random>
    <larger-post></larger-post>
  </v-app>
</template>

<script>
import { Latest, LargerPost, Random } from './views'

export default {
  name: 'App',
  components: { Latest, LargerPost, Random },
}
</script>

<style>
@import 'assets/css/base.css';
</style>
