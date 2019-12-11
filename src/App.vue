<template>
  <v-app id="app">
    <home></home>
    <larger></larger>
  </v-app>
</template>

<script>
import { Home, Larger } from './views'

export default {
  name: 'App',
  components: { Home, Larger },
}
</script>

<style>
@import 'assets/css/base.css';
</style>
