<template>
  <div id="container">
    <v-card :loading="isLoading" outlined class="container-card mx-auto">
      <v-card-title class="container-card-header d-flex flex-row">
        <div class="container-div-indicator">
          <slot name="header-left-indicator">
            <v-btn
              v-if="isShowHeaderLeftIndicator"
              text
              icon
              large
              :disabled="isLoading"
              @click="back"
            >
              <v-icon color="black">mdi-arrow-left</v-icon>
            </v-btn>
          </slot>
        </div>
        <slot name="header-title"></slot>
        <v-spacer></v-spacer>
        <slot name="header-action"></slot>
      </v-card-title>
      <div class="container-div" :style="containerDivStyle">
        <slot name="content"></slot>
      </div>
      <v-card-actions class="container-card-footer">
        <div class="container-div-indicator">
          <slot name="footer-left-indicator">
            <v-btn
              v-if="isShowFooterLeftIndicator"
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
              v-if="isShowFooterRightIndicator"
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
    isShowHeaderLeftIndicator: {
      type: Boolean,
      default: false,
    },
    isShowFooterLeftIndicator: {
      type: Boolean,
      default: true,
    },
    isShowFooterRightIndicator: {
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
  methods: {
    back() {
      this.$router.go(-1)
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
  justify-items: center;
}

.container-div-indicator {
  width: 52px;
}

.container-card-header,
.container-card-footer {
  width: 100%;
  text-align: center;
}
</style>
