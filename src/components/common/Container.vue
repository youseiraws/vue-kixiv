<template>
  <div id="container">
    <v-card :loading="isLoading" outlined class="container-card mx-auto" min-height="100vh">
      <v-card-title class="container-card-header d-flex flex-row justify-end">
        <slot name="header-title"></slot>
      </v-card-title>
      <div class="container-div" :style="containerDivStyle">
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
        <div class="flex-grow-1">
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
      v-if="isShowRefresh"
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
    columns: {
      type: Number,
      default: 4,
    },
    gap: {
      type: Number,
      default: 8,
    },
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
    isShowRefresh: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    containerDivStyle() {
      return {
        'grid-template-columns': `repeat(${this.columns}, 1fr)`,
        'grid-gap': `${this.gap}px`,
      }
    },
  },
}
</script>

<style scoped>
.container-card {
  width: 80vw;
  border: none !important;
}

.container-div {
  display: grid;
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
