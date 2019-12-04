<template>
  <v-app id="app">
    <latest></latest>
  </v-app>
</template>

<script>
  import Latest from './views/Latest'

  export default {
    name: 'App',
    components: {Latest},
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
