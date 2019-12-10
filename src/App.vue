<template>
  <v-app id="app">
    <random></random>
    <larger-post></larger-post>
  </v-app>
</template>

<script>
import { LargerPost, Latest, Random, Category } from './views'

export default {
  name: 'App',
  components: { LargerPost, Latest, Random, Category },
}
</script>

<style>
@import 'assets/css/base.css';
</style>
