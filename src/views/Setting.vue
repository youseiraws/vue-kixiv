<template>
  <div id="setting">
    <container
      :columns="1"
      :is-show-footer-left-indicator="false"
      :is-show-footer-right-indicator="false"
      :is-show-refresh="false"
    >
      <template #header-title>设置</template>
      <template #content>
        <div class="setting-content">
          <span>图片适应模式</span>
          <v-switch class="action-control" v-model="containModel" inset dense hide-details>
            <template #label>{{containText}}</template>
          </v-switch>

          <span>图片评级</span>
          <v-btn-toggle class="action-control" v-model="ratingModel" mandatory multiple dense>
            <v-btn
              v-for="rating in ratings"
              :key="rating"
              light
              outlined
              :value="rating[0]"
            >{{rating}}</v-btn>
          </v-btn-toggle>

          <span>轮播间隔秒数</span>
          <v-slider
            class="action-control action-slider d-flex align-center"
            v-model="carouselsIntervalModel"
            :min="0"
            :max="60"
            thumb-label="always"
            hide-details
            validate-on-blur
          >
            <template v-slot:append>
              <v-text-field
                class="action-short-input"
                v-model="carouselsIntervalModel"
                dense
                outlined
                single-line
                hide-details
              ></v-text-field>
            </template>
          </v-slider>

          <span>收藏每页图片数</span>
          <v-slider
            class="action-control action-slider d-flex align-center"
            v-model="pageSizeModel"
            :min="1"
            :max="100"
            thumb-label="always"
            hide-details
            validate-on-blur
          >
            <template v-slot:append>
              <v-text-field
                class="action-short-input"
                v-model="pageSizeModel"
                dense
                outlined
                single-line
                hide-details
              ></v-text-field>
            </template>
          </v-slider>
        </div>
      </template>
    </container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import _ from 'lodash'
import { Container } from '../components'

const { mapGetters, mapActions } = createNamespacedHelpers('setting')

export default {
  name: 'Setting',
  components: {
    Container,
  },
  data() {
    return {
      ratings: ['safe', 'questionable', 'explicit'],
      containModel: false,
      ratingModel: ['s', 'q', 'e'],
      carouselsIntervalModel: 6,
      pageSizeModel: 100,
      debouncedUpdate: null,
    }
  },
  computed: {
    ...mapGetters(['settings']),
    containText() {
      return this.containModel ? 'CONTAIN' : 'COVER'
    },
  },
  watch: {
    containModel(newContainModel) {
      this.debouncedUpdate({ name: 'CONTAIN', value: newContainModel })
    },
    ratingModel(newRatingModel) {
      this.debouncedUpdate({ name: 'RATING', value: newRatingModel })
    },
    carouselsIntervalModel(newCarouselsIntervalModel) {
      this.debouncedUpdate({
        name: 'CAROUSELS_INTERVAL',
        value: newCarouselsIntervalModel,
      })
    },
    pageSizeModel(newPageSizeModel) {
      this.debouncedUpdate({ name: 'PAGE_SIZE', value: newPageSizeModel })
    },
    settings(newSettings) {
      this.containModel = newSettings['CONTAIN'] || false
      if (!_.isEqual(new Set(this.ratingModel), new Set(newSettings['RATING'])))
        this.ratingModel = newSettings['RATING'] || ['s', 'q', 'e']
      this.carouselsIntervalModel = newSettings['CAROUSELS_INTERVAL'] || 6
      this.pageSizeModel = newSettings['PAGE_SIZE'] || 100
    },
  },
  methods: {
    ...mapActions({
      update: 'UPDATE',
    }),
  },
  created() {
    this.debouncedUpdate = _.debounce(
      ({ name, value }) => this.update({ name, value }),
      1000,
    )
  },
  destroyed() {
    this.debouncedUpdate.cancel()
  },
}
</script>

<style scoped>
.setting-content {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 100px);
  align-items: center;
  justify-items: center;
}

.action-control {
  justify-self: start;
}

.action-slider {
  width: 200px;
}

.action-short-input {
  width: 60px;
}
</style>