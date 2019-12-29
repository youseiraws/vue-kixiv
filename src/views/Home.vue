<template>
  <div id="home">
    <v-toolbar class="home-toolbar" flat>
      <v-toolbar-title>
        <v-btn-toggle v-model="leftTab" group borderless mandatory>
          <v-btn
            v-for="leftTab in leftTabs"
            :key="leftTab.value"
            :value="leftTab.value"
            width="100"
          >
            <v-icon left>{{leftTab.icon}}</v-icon>
            {{leftTab.text}}
          </v-btn>
        </v-btn-toggle>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="rightTab" group borderless mandatory>
        <v-btn
          v-for="rightTab in rightTabs"
          :key="rightTab.value"
          :value="rightTab.value"
          width="100"
        >
          <v-icon left>{{rightTab.icon}}</v-icon>
          {{rightTab.text}}
        </v-btn>
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
      leftTab: {},
      leftTabs: [
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
          icon: 'mdi-view-grid-outline',
        },
      ],
      rightTab: {},
      rightTabs: [
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
    leftTab(newLeftTab) {
      this.$router.push({ name: newLeftTab })
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

.home-content {
  margin-top: 64px;
}
</style>