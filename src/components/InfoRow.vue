<template>
  <div id="info-row" class="d-flex flex-row">
      <span>{{text}}</span>
      <v-spacer></v-spacer>
      <span>{{value}}</span>
  </div>
</template>

<script>
export default {
  name: 'InfoRow',
  props: {
    text: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
}
</script>

<style>
</style>