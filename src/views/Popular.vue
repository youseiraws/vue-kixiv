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
        <div class="d-inline-flex align-center">
          <v-menu offset-y transition="scroll-y-transition" :disabled="isLoading">
            <template #activator="{on}">
              <v-btn light outlined v-on="on" :disabled="isLoading">{{popularType.name}}</v-btn>
            </template>
            <template>
              <v-list>
                <v-list-item-group v-model="popularType" mandatory>
                  <v-list-item
                    v-for="popularType in popularTypes"
                    :key="popularType.value"
                    :value="popularType"
                  >
                    <v-list-item-title>{{popularType.name}}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </template>
          </v-menu>
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
              <v-date-picker
                class="popular-date-picker"
                no-title
                scrollable
                :show-current="false"
                :type="datePickerType"
                locale="zh-cn"
                v-model="pickerDate"
                :max="yesterday"
              ></v-date-picker>
            </template>
          </v-menu>
        </div>
      </template>
      <template #content v-if="!isDurationEmpty">
        <post
          v-for="post in duration"
          :key="post.id"
          :width="301"
          :post="post"
          :posts="total"
          :load-more="prevDuration"
        ></post>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
import { Container, Post } from '../components'

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
      popularTypes: [
        {
          name: '日排行',
          value: 'day',
        },
        {
          name: '周排行',
          value: 'week',
        },
        {
          name: '月排行',
          value: 'month',
        },
      ],
      popularType: {
        name: '日排行',
        value: 'day',
      },
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
      'type',
      'duration',
      'total',
      'isLoading',
      'isDurationEmpty',
      'hasNextDuration',
      'hasCached',
    ]),
    formatedDisplayDate() {
      if (!this.date) return ''
      switch (this.type) {
        case 'day':
          return this.date.format(dateDisplayFormat)
        case 'week':
          return `${this.date
            .clone()
            .isoWeekday('Monday')
            .format(dateDisplayFormat)}-${this.date
            .clone()
            .isoWeekday('Sunday')
            .format(dateDisplayFormat)}`
        case 'month':
          return this.date.format(monthDisplayFormat)
      }
    },
    datePickerType() {
      return this.type === 'month' ? 'month' : 'date'
    },
  },
  watch: {
    pickerDate(newPickerDate) {
      this.menu = false
      this.loadDuration(moment.utc(newPickerDate, dateFormat))
    },
    date(newDate) {
      this.pickerDate = newDate.format(dateFormat)
    },
    popularType(newPopularType) {
      this.searchDuration(newPopularType.value)
    },
  },
  methods: {
    ...mapActions({
      loadDuration: 'LOAD_DURATION',
      prevDuration: 'PREV_DURATION',
      nextDuration: 'NEXT_DURATION',
      searchDuration: 'SEARCH_DURATION',
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
.popular-date-picker {
  width: 100%;
}
</style>