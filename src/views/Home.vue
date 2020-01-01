<template>
  <div id="home">
    <v-toolbar class="home-toolbar" flat>
      <v-btn-toggle class="home-actions d-flex" v-model="tab" group borderless mandatory>
        <template v-for="tab in tabs">
          <v-spacer v-if="tab.value==='spacer'" :key="tab.value"></v-spacer>
          <v-btn v-else :key="tab.value" :value="tab.value" width="100">
            <v-icon left>{{tab.icon}}</v-icon>
            {{tab.text}}
          </v-btn>
        </template>
      </v-btn-toggle>
    </v-toolbar>
    <div class="home-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
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
      tab: '',
      tabs: [
        {
          value: 'latest',
          text: '最新',
          icon: 'mdi-new-box',
        },
        {
          value: 'random',
          text: '随机',
          icon: 'mdi-shuffle-variant',
        },
        {
          value: 'popular',
          text: '热门',
          icon: 'mdi-fire',
        },
        {
          value: 'category',
          text: '分类',
          icon: 'mdi-view-grid',
        },
        {
          value: 'spacer',
        },
        {
          value: 'collection',
          text: '收藏',
          icon: 'mdi-star',
        },
        {
          value: 'setting',
          text: '设置',
          icon: 'mdi-settings',
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
  padding: 0 32px;
  border-bottom: 1px solid #e0e0e0 !important;
}

.home-actions {
  width: 100vw;
}

.home-content {
  margin-top: 64px;
}
</style>