<template>
  <div id="setting">
    <container>
      <template #content>
        <v-item-group>
          <v-item>
            <v-switch v-model="containModel" inset>
              <template #prepend>图片适应模式</template>
              <template #label>{{containText}}</template>
            </v-switch>
          </v-item>
        </v-item-group>
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
    }
  },
  computed: {
    ...mapGetters(['contain']),
    containText() {
      return this.containModel ? 'CONTAIN' : 'COVER'
    },
  },
  watch: {
    containModel(newconatainModel) {
      this.setContain(newconatainModel)
    },
  },
  methods: {
    ...mapMutations({
      setContain: 'SET_CONTAIN',
    }),
  },
  created() {
    this.containModel = this.contain
  },
}
</script>

<style>
</style>