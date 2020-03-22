<template>
  <div id="tooltip">
    <v-snackbar
      class="tooltip-snackbar"
      v-model="visibilityModel"
      color="white"
      top
      right
      multi-line
      vertical
      :timeout="0"
    >
      <div class="tooltip-content">{{content}}</div>
      <v-progress-linear v-if="progress" indeterminate rounded height="10" striped></v-progress-linear>
      <v-btn v-if="close" color="blue" text @click="visibilityModel = false">关闭</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters, mapMutations } = createNamespacedHelpers('tooltip')

export default {
  name: 'Tooltip',
  data() {
    return {
      visibilityModel: false,
    }
  },
  computed: {
    ...mapGetters(['visibility', 'content', 'progress', 'close']),
  },
  watch: {
    visibilityModel(newVisibilityModel) {
      this.setVisibility(newVisibilityModel)
    },
    visibility(newVisibility) {
      this.visibilityModel = newVisibility
    },
  },
  methods: {
    ...mapMutations({ setVisibility: 'SET_VISIBILITY' }),
  },
}
</script>

<style scoped>
.tooltip-snackbar {
  position: fixed;
}
.tooltip-content {
  color: black;
}
</style>