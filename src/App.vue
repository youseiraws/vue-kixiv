<template>
  <v-app id="app">
    <latest></latest>
    <larger-post></larger-post>
  </v-app>
</template>

<script>
import { Latest, LargerPost } from './views'

export default {
  name: 'App',
  components: { Latest, LargerPost },
}
</script>

<style>
@import 'assets/css/base.css';
</style>
