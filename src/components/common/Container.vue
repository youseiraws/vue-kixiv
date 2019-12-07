<template>
  <div id="container">
    <v-card :loading="isLoading" outlined class="container-card mx-auto" min-height="100vh">
      <v-card-title class="container-card-header d-flex flex-row justify-end">
        <slot name="header-title"></slot>
      </v-card-title>
      <div class="d-flex flex-row justify-start align-start align-content-start flex-wrap">
        <slot name="content"></slot>
      </div>
      <v-card-actions class="container-card-footer">
        <div class="container-div-indicator">
          <slot name="footer-left-indicator">
            <v-btn
              v-if="isShowLeftIndicator"
              text
              icon
              x-large
              :loading="isLoading"
              :disabled="isLoading"
              @click="$emit('footer-left-indicator-click')"
            >
              <v-icon color="black">mdi-chevron-left</v-icon>
            </v-btn>
          </slot>
        </div>
        <div class="mx-auto">
          <slot name="footer-title"></slot>
        </div>
        <div class="container-div-indicator">
          <slot name="footer-right-indicator">
            <v-btn
              v-if="isShowRightIndicator"
              text
              icon
              x-large
              :loading="isLoading"
              :disabled="isLoading"
              @click="$emit('footer-right-indicator-click')"
            >
              <v-icon color="black">mdi-chevron-right</v-icon>
            </v-btn>
          </slot>
        </div>
      </v-card-actions>
    </v-card>
    <v-btn
      fab
      large
      fixed
      bottom
      right
      color="black"
      :loading="isLoading"
      :disabled="isLoading"
      @click="$emit('refresh-click')"
    >
      <v-icon color="white">mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'Container',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    isShowLeftIndicator: {
      type: Boolean,
      default: true,
    },
    isShowRightIndicator: {
      type: Boolean,
      default: true,
    },
  },
}
</script>

<style scoped>
.container-card {
  width: 80vw;
}

.container-div-indicator {
  width: 52px;
}

.container-card-header,
.container-card-footer {
  width: 100%;
  height: 72px;
  text-align: center;
}
</style>
