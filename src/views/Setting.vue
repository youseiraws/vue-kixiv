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

          <span>轮播间隔秒数</span>
          <v-slider
            class="action-control action-control-interval d-flex align-center"
            v-model="carouselsIntervalModel"
            :min="0"
            :max="60"
            thumb-label="always"
            hide-details
            validate-on-blur
          >
            <template v-slot:append>
              <v-text-field
                class="action-input-interval"
                v-model="carouselsIntervalModel"
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
import { Container } from '../components'

const { mapGetters, mapMutations } = createNamespacedHelpers('setting')

export default {
  name: 'Setting',
  components: {
    Container,
  },
  data() {
    return {
      containModel: false,
      carouselsIntervalModel: 6,
    }
  },
  computed: {
    ...mapGetters(['contain', 'carouselsInterval']),
    containText() {
      return this.containModel ? 'CONTAIN' : 'COVER'
    },
  },
  watch: {
    containModel(newConatainModel) {
      this.setContain(newConatainModel)
    },
    carouselsIntervalModel(newCarouselsIntervalModel) {
      this.setCarouselsInterval(newCarouselsIntervalModel)
    },
  },
  methods: {
    ...mapMutations({
      setContain: 'SET_CONTAIN',
      setCarouselsInterval: 'SET_CAROUSELS_INTERVAL',
    }),
  },
  created() {
    this.containModel = this.contain
    this.carouselsIntervalModel = this.carouselsInterval
  },
}
</script>

<style scoped>
.setting-content {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 100px);
  align-items: center;
  justify-items: center;
}

.action-control {
  justify-self: start;
}

.action-control-interval {
  width: 200px;
}

.action-input-interval {
  width: 60px;
}
</style>