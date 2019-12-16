<template>
  <div id="popular">
    <container
      :is-loading="isLoading"
      :is-show-footer-left-indicator="hasNextDuration"
      :is-show-refresh="!hasCached"
      @footer-left-indicator-click="nextDuration"
      @footer-right-indicator-click="prevDuration"
      @refresh-click="refreshDuration"
    >
      <template #header-action>
        <v-menu
          v-model="menu"
          offset-y
          nudge-left="72.5"
          transition="scroll-y-transition"
          :close-on-content-click="false"
          :disabled="isLoading"
        >
          <template #activator="{on}">
            <v-btn text x-large v-on="on" :disabled="isLoading">{{date | formatDisplayDate}}</v-btn>
          </template>
          <template>
            <v-date-picker no-title scrollable locale="zh-cn" v-model="pickerDate" :max="yesterday"></v-date-picker>
          </template>
        </v-menu>
      </template>
      <template #content v-if="!isDurationEmpty">
        <post v-for="post in popular" :key="post.id" :size="301" :post="post" :posts="popular"></post>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
import { Container, Post } from '../components/common'

const { mapGetters, mapActions } = createNamespacedHelpers('popular')
const dateFormat = 'YYYY-MM-DD'
const dateDisplayFormat = 'YYYY年MM月DD日'
const monthDisplayFormat = 'YYYY年MM月'

export default {
  name: 'Popular',
  components: {
    Container,
    Post,
  },
  data() {
    return {
      yesterday: moment()
        .utc()
        .subtract(1, 'days')
        .format(dateFormat),
      pickerDate: moment()
        .utc()
        .subtract(1, 'days')
        .format(dateFormat),
      menu: false,
      autoRefreshTimer: null,
    }
  },
  computed: {
    ...mapGetters([
      'date',
      'startDate',
      'type',
      'duration',
      'isLoading',
      'isDurationEmpty',
      'hasNextDuration',
      'hasCached',
    ]),
  },
  watch: {
    pickerDate(newPickerDate) {
      this.menu = false
      this.loadDuration(moment.utc(newPickerDate, dateFormat))
    },
    date(newDate) {
      this.pickerDate = newDate
    },
  },
  filters: {
    formatDisplayDate(date) {
      if (!date) return ''
      switch (this.type) {
        case 'day':
          return this.startDate.format(dateDisplayFormat)
        case 'week':
          return `${this.startDate.format(dateDisplayFormat)}-${this.startDate
            .day('Sunday')
            .format(dateDisplayFormat)}`
        case 'month':
          return this.startDate.format(monthDisplayFormat)
      }
    },
  },
  methods: {
    ...mapActions({
      loadDuration: 'LOAD_DURATION',
      prevDuration: 'PREV_DURATION',
      nextDuration: 'NEXT_DURATION',
      refreshDuration: 'REFRESH_DURATION',
    }),
  },
  created() {
    this.loadDuration()
    this.autoRefreshTimer = window.setInterval(
      () => this.refreshDuration(),
      20000,
    )
  },
  destroyed() {
    window.clearInterval(this.autoRefreshTimer)
  },
}
</script>

<style scoped>
</style>