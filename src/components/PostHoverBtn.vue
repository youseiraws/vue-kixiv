<template>
  <div id="post-hover-btn">
    <v-menu
      v-model="menuModel"
      offset-x
      left
      :open-on-hover="openOnHover"
      :close-on-content-click="false"
      :open-delay="500"
      :close-delay="500"
      :min-width="300"
      :nudge-left="6"
      transition="scroll-x-reverse-transition"
    >
      <template #activator="{on}">
        <v-btn v-on="on" icon :large="large">
          <slot name="icon"></slot>
        </v-btn>
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
  props: {
    large: {
      type: Boolean,
      default: false,
    },
    openOnHover: {
      type: Boolean,
      default: true,
    },
    menu: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuModel: false,
    }
  },
  watch: {
    menuModel(newMenuModel) {
      this.$emit('menu-changed', newMenuModel)
    },
    menu(newMenu) {
      this.menuModel = newMenu
    },
  },
}
</script>

<style>
</style>