<template>
  <v-card class="container-card d-flex flex-row justify-start flex-wrap mx-auto">
    <v-card-title class="container-card-title">
      <div class="container-div-indicator">
        <slot name="left-indicator">
          <v-btn
            v-if="isShowLeftIndicator"
            icon
            large
            :loading="isLoading"
            :disabled="isLoading"
            @click="$emit('left-indicator-click')"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </slot>
      </div>
      <h2 class="mx-auto">
        <slot name="title"></slot>
      </h2>
      <div class="container-div-indicator">
        <slot name="right-indicator">
          <v-btn
            v-if="isShowRightIndicator"
            icon
            large
            :loading="isLoading"
            :disabled="isLoading"
            @click="$emit('right-indicator-click')"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </slot>
      </div>
    </v-card-title>
    <slot></slot>
  </v-card>
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
  width: 40px;
  height: 40px;
}

.container-card-title {
  width: 100%;
  height: 72px;
  text-align: center;
}
</style>