<template>
  <div id="latest">
    <container
      :is-loading="isLoading"
      :is-show-left-indicator="hasNextDaily"
      @left-indicator-click="nextDaily"
      @right-indicator-click="prevDaily"
    >
      <template #content v-if="!isDailyEmpty">
        <post v-for="post in daily" :key="post.id" :post="post" :posts="daily"></post>
      </template>
      <template #footer-title>
        <v-menu
          v-model="menu"
          offset-y
          nudge-left="72.5"
          transition="scroll-y-transition"
          :close-on-content-click="false"
          :disabled="isLoading"
        >
          <template v-slot:activator="{on}">
            <v-btn text x-large v-on="on" :disabled="isLoading">{{date}}</v-btn>
          </template>
          <template>
            <v-date-picker no-title scrollable locale="zh-cn" v-model="pickerDate" :max="today"></v-date-picker>
          </template>
        </v-menu>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
import { Container, Post } from '../components/common'

const { mapGetters, mapActions } = createNamespacedHelpers('latest')
const dateFormat = 'YYYY-MM-DD'

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
    }
  },
  computed: {
    ...mapGetters([
      'date',
      'daily',
      'isLoading',
      'isDailyEmpty',
      'hasNextDaily',
    ]),
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
    }),
  },
  created() {
    this.pickerDate = this.date
    this.loadDaily()
  },
}
</script>

<style scoped>
</style>
