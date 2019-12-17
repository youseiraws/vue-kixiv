<template>
  <div id="latest">
    <container
      :is-loading="isLoading"
      :is-show-footer-left-indicator="hasNextDaily"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="nextDaily"
      @footer-right-indicator-click="prevDaily"
      @refresh-click="refreshDaily"
    >
      <template #header-action>
        <v-menu
          v-model="menu"
          offset-y
          transition="scroll-y-transition"
          :close-on-content-click="false"
          :disabled="isLoading"
        >
          <template #activator="{on}">
            <v-btn text x-large v-on="on" :disabled="isLoading">{{formatedDisplayDate}}</v-btn>
          </template>
          <template>
            <v-date-picker no-title scrollable locale="zh-cn" v-model="pickerDate" :max="today"></v-date-picker>
          </template>
        </v-menu>
      </template>
      <template #content v-if="!isDailyEmpty">
        <post v-for="post in daily" :key="post.id" :size="301" :post="post" :posts="daily"></post>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
import { Container, Post } from '../components'

const { mapGetters, mapActions } = createNamespacedHelpers('latest')
const dateFormat = 'YYYY-MM-DD'
const dateDisplayFormat = 'YYYY年MM月DD日'

export default {
  name: 'Latest',
  components: {
    Container,
    Post,
  },
  data() {
    return {
      today: moment()
        .utc()
        .format(dateFormat),
      pickerDate: moment()
        .utc()
        .format(dateFormat),
      menu: false,
      autoRefreshTimer: null,
    }
  },
  computed: {
    ...mapGetters([
      'date',
      'daily',
      'isLoading',
      'isDailyEmpty',
      'hasNextDaily',
      'hasCached',
    ]),
    formatedDisplayDate() {
      if (!this.date) return ''
      return moment.utc(this.date, dateFormat).format(dateDisplayFormat)
    },
  },
  watch: {
    pickerDate(newPickerDate) {
      this.menu = false
      this.loadDaily(newPickerDate)
    },
    date(newDate) {
      this.pickerDate = newDate
    },
  },
  methods: {
    ...mapActions({
      loadDaily: 'LOAD_DAILY',
      prevDaily: 'PREV_DAILY',
      nextDaily: 'NEXT_DAILY',
      refreshDaily: 'REFRESH_DAILY',
    }),
  },
  created() {
    this.loadDaily()
    this.autoRefreshTimer = window.setInterval(() => this.refreshDaily(), 20000)
  },
  destroyed() {
    window.clearInterval(this.autoRefreshTimer)
  },
}
</script>

<style scoped>
</style>
