<template>
  <div id="home">
    <v-toolbar class="home-toolbar" flat>
      <v-toolbar-title class="ml-8">
        <v-btn-toggle v-model="tab" group borderless mandatory>
          <v-btn v-for="tab in tabs" :key="tab.value" :value="tab.value" width="100">{{tab.text}}</v-btn>
        </v-btn-toggle>
      </v-toolbar-title>
    </v-toolbar>
    <div class="home-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { Latest, Random, Popular, Category } from './index'

export default {
  name: 'Home',
  components: {
    Latest,
    Random,
    Popular,
    Category,
  },
  data() {
    return {
      tab: null,
      tabs: [
        {
          value: 'latest',
          text: '最新',
        },
        {
          value: 'random',
          text: '随机',
        },
        {
          value: 'popular',
          text: '热门',
        },
        {
          value: 'category',
          text: '分类',
        },
      ],
    }
  },
  watch: {
    tab(newTab) {
      this.$router.push({ name: newTab })
    },
  },
}
</script>

<style scoped>
.home-toolbar {
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 64px;
  border-bottom: 1px solid #e0e0e0 !important;
}

.home-content {
  margin-top: 64px;
}
</style>