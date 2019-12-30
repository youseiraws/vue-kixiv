<template>
  <div id="post-hover-btn">
    <v-menu
      offset-x
      left
      open-on-hover
      :close-on-content-click="false"
      :open-delay="500"
      :close-delay="500"
      :min-width="300"
      :nudge-left="6"
      transition="scroll-x-transition"
    >
      <template #activator="{on}">
        <slot name="activator" :on="on"></slot>
      </template>
      <template>
        <slot></slot>
      </template>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'PostHoverBtn',
}
</script>

<style>
</style>