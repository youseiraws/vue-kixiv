<template>
  <div id="latest">
    <v-card class="latest-card d-flex flex-row justify-start flex-wrap mx-auto" v-if="!isLatestEmpty">
      <v-card-title class="latest-card-title">
        <div class="latest-div-indicator">
          <div v-if="hasNextDaily">
            <div v-if="isLoading">
              <v-progress-circular :size="24" :width="3" indeterminate/>
            </div>
            <div v-else>
              <chevron-left-icon size="1.5x" @click="nextDaily"/>
            </div>
          </div>
        </div>
        <h2 class="mx-auto">{{date}}</h2>
        <div class="latest-div-indicator">
          <div v-if="isLoading">
            <v-progress-circular :size="24" :width="3" indeterminate/>
          </div>
          <div v-else>
            <chevron-right-icon size="1.5x" @click="prevDaily"/>
          </div>
        </div>
      </v-card-title>
      <v-hover class="latest-hover" v-for="post in latest[date]" :key="post.id">
        <template #default="{ hover }">
          <v-card :raised="hover" @click="openLargerPostView(post)">
            <v-img :aspect-ratio="16/9"
                   :src="getPostUrl(post,'sample')"
                   :lazy-src="getPostUrl(post,'preview')">
            </v-img>
          </v-card>
        </template>
      </v-hover>
    </v-card>
    <v-overlay :value="overlay">
      <div class="d-flex flex-row justify-center align-center">
        <div class="latest-div-overlay-indicator">
          <div v-if="hasPrevPost">
            <chevron-left-icon size="6x" @click="prevLargerPost"/>
          </div>
        </div>
        <v-card class="latest-card-overlay">
          <v-img :aspect-ratio="16/9"
                 :src="getPostUrl(largerPost,'file')"
                 :lazy-src="getPostUrl(largerPost,'jpeg')"
                 @click="closeLargerPostView">
          </v-img>
        </v-card>
        <div class="latest-div-overlay-indicator">
          <div v-if="hasNextPost">
            <chevron-right-icon size="6x" @click="nextLargerPost"/>
          </div>
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {LOAD_DAILY, PREV_DAILY, NEXT_DAILY} from '../store'
  import {ChevronLeftIcon, ChevronRightIcon} from 'vue-feather-icons'

  export default {
    name: 'Latest',
    components: {
      ChevronLeftIcon,
      ChevronRightIcon
    },
    data() {
      return {
        overlay: false,
        largerPost: null,
        largerPostIndex: 0,
      }
    },
    computed: {
      hasPrevPost() {
        return this.largerPostIndex !== 0
      },
      hasNextPost() {
        if(this.daily===undefined) return false
        return this.largerPostIndex !== this.daily.length - 1
      },
      ...mapGetters(['date', 'latest', 'daily', 'isLoading', 'isDailyEmpty', 'isLatestEmpty', 'hasNextDaily'])
    },
    created() {
      this.loadDaily()
    },
    methods: {
      loadDaily() {
        this.$store.dispatch(LOAD_DAILY)
      },
      prevDaily() {
        this.$store.dispatch(PREV_DAILY)
      },
      nextDaily() {
        this.$store.dispatch(NEXT_DAILY)
      },
      getPostUrl(post, postType) {
        if (post === null) return
        if (post.storage === undefined || post.storage[`${postType}_url`] === undefined)
          return post[`${postType}_url`]
        else
          return post.storage[`${postType}_url`]
      },
      openLargerPostView(post) {
        this.largerPost = post
        this.overlay = true
        this.setLargerPostIndex()
      },
      closeLargerPostView(post) {
        this.overlay = false
      },
      setLargerPostIndex() {
        this.largerPostIndex = this.daily.findIndex(post => post.id === this.largerPost.id)
      },
      prevLargerPost() {
        this.largerPostIndex--
        this.largerPost = this.daily[this.largerPostIndex]
      },
      nextLargerPost() {
        this.largerPostIndex++
        this.largerPost = this.daily[this.largerPostIndex]
      }
    }
  }
</script>

<style scoped>
  .latest-card {
    width: 80vw;
  }

  .latest-div-indicator {
    width: 40px;
    height: 40px;
  }

  .latest-hover {
    width: 24%;
    margin: 6px;
  }

  .latest-card-title {
    width: 100%;
    height: 72px;
    text-align: center;
  }

  .latest-card-overlay {
    width: 84vw;
  }

  .latest-div-overlay-indicator {
    width: 8vw;
    text-align: center;
  }
</style>
