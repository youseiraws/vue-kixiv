<template>
  <div id="collection" v-if="!isLoading">
    <v-tabs v-model="tab" class="collection-tabs" vertical>
      <v-tab
        class="collection-tab"
        v-for="(collection,index) in collections"
        :key="collection.name"
        :href="`#${collection.name}`"
      >
        <template v-if="editCollectionSwitchs[index]">
          <v-text-field
            class="collection-input"
            v-model="editedCollection"
            dense
            solo
            single-line
            autofocus
            hide-details
            append-outer-icon="mdi-check-circle-outline"
            @click:append-outer="editCollection(collection,index)"
            @keyup.enter="editCollection(collection,index)"
          ></v-text-field>
        </template>
        <template v-else>
          {{collection.name}}
          <span class="grey--text ml-2">{{collection.posts.length}}</span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            v-show="collection.name!=='默认收藏集'&&collection.name===tab"
            @click.stop="switchEditCollection(collection,index)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            v-show="collection.name!=='默认收藏集'&&collection.name===tab"
            @click.stop="confirmRemoveCollection(collection)"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
      </v-tab>
      <v-list-item v-if="addCollectionSwitch">
        <v-text-field
          class="collection-input"
          v-model="addedCollection"
          dense
          solo
          single-line
          autofocus
          hide-details
          append-outer-icon="mdi-check-circle-outline"
          @click:append-outer="addCollection()"
          @keyup.enter="addCollection()"
        ></v-text-field>
      </v-list-item>
      <v-list-item v-else @click="switchAddCollection()">
        <v-list-item-icon>
          <v-icon>mdi-book-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-title>新建收藏集</v-list-item-title>
      </v-list-item>
      <v-spacer></v-spacer>
      <v-tab class="collection-tab" :href="`#${blacklist.name}`">
        {{blacklist.name}}
        <span class="grey--text ml-2">{{blacklist.posts.length}}</span>
      </v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(collection,index) in totalCollections"
          :key="collection.name"
          :value="collection.name"
        >
          <container
            :is-show-footer-left-indicator="hasPrevPage"
            :is-show-footer-right-indicator="hasNextPage"
            :is-show-refresh="false"
            @footer-left-indicator-click="prevCollection"
            @footer-right-indicator-click="nextCollection"
          >
            <template #header-title>
              <v-checkbox
                class="mt-0 pt-0"
                v-show="showCheckbox&&index!==totalCollections.length-1"
                v-model="checkAll"
                label="全选"
                hide-details
                @change="clickCheckbox"
              ></v-checkbox>
            </template>
            <template #header-action>
              <v-btn
                v-show="index!==totalCollections.length-1"
                light
                outlined
                @click="download()"
              >下载</v-btn>
            </template>
            <template #content>
              <post
                v-for="post in currentPosts"
                :key="post.id"
                :show-blacked="index===totalCollections.length-1"
                :width="301"
                :post="post"
                :disabled="showCheckbox"
                @post-clicked="clickPost(post)"
              >
                <template #action>
                  <v-checkbox
                    class="collection-checkbox"
                    v-show="showCheckbox"
                    v-model="checkeds"
                    :value="post"
                  ></v-checkbox>
                </template>
              </post>
            </template>
            <template #footer-title>
              <v-pagination v-model="pagination" :length="currentLength"></v-pagination>
            </template>
          </container>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-card-title>
          <span>确定删除</span>
          <span class="red--text">{{removedCollection.name}}</span>
          <span>收藏集吗？</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancel()">取消</v-btn>
          <v-btn text @click="removeCollection()">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { Container, Post } from '../components'
import { downloadImages } from '../util/util'

const dateDisplayFormat = 'YYYYMMDD-HHmmss'

export default {
  name: 'Collection',
  components: {
    Container,
    Post,
  },
  data() {
    return {
      tab: '默认收藏集',
      pagination: 1,
      addCollectionSwitch: false,
      editCollectionSwitchs: [],
      addedCollection: '',
      editedCollection: '',
      removedCollection: {},
      dialog: false,
      showCheckbox: false,
      checkAll: false,
      checkeds: [],
    }
  },
  computed: {
    ...mapGetters('collection', ['collections', 'blacklist', 'isLoading']),
    ...mapGetters('setting', ['pageSize']),
    totalCollections() {
      if (this.collections !== undefined && this.blacklist !== undefined)
        return [...this.collections, this.blacklist]
    },
    currentCollection() {
      if (this.totalCollections !== undefined)
        return this.totalCollections.find(
          collection => collection.name === this.tab,
        )
    },
    currentPosts() {
      if (this.currentCollection === undefined) return []
      return this.currentCollection.posts.slice(
        (this.pagination - 1) * this.pageSize,
        this.pagination * this.pageSize,
      )
    },
    currentLength() {
      if (this.currentCollection === undefined) return 0
      return Math.ceil(this.currentCollection.posts.length / this.pageSize)
    },
    unblackedPosts() {
      return this.currentPosts.filter(
        post => !this.blacklist.posts.map(post => post.id).includes(post.id),
      )
    },
    hasPrevPage() {
      return this.pagination > 1
    },
    hasNextPage() {
      return this.pagination < this.currentLength
    },
  },
  watch: {
    tab(newTab) {
      this.pagination = 1
    },
    pagination(newPagination) {
      this.checkAll = this.unblackedPosts.every(unblackedPost =>
        this.checkeds
          .map(checkedPost => checkedPost.id)
          .includes(unblackedPost.id),
      )
    },
    currentLength(newCurrentLength) {
      this.pagination =
        this.pagination > newCurrentLength ? newCurrentLength : this.pagination
    },
    collections(newCollections) {
      this.editCollectionSwitchs = new Array(newCollections.length).fill(false)
    },
    checkeds(newCheckeds) {
      this.checkAll = this.unblackedPosts.every(unblackedPost =>
        newCheckeds
          .map(checkedPost => checkedPost.id)
          .includes(unblackedPost.id),
      )
    },
  },
  methods: {
    ...mapActions('collection', {
      add: 'ADD',
      edit: 'EDIT',
      remove: 'REMOVE',
      like: 'LIKE',
      dislike: 'DISLIKE',
    }),
    ...mapActions('larger', { openLarger: 'OPEN_LARGER' }),
    prevCollection() {
      this.pagination--
    },
    nextCollection() {
      this.pagination++
    },
    switchAddCollection() {
      this.addCollectionSwitch = true
    },
    addCollection() {
      this.addCollectionSwitch = false
      this.add(this.addedCollection)
      this.addedCollection = ''
    },
    switchEditCollection(collection, index) {
      this.editedCollection = collection.name
      this.editCollectionSwitchs.splice(index, 1, true)
    },
    async editCollection(collection, index) {
      const temp = this.tab
      this.editCollectionSwitchs.splice(index, 1, false)
      await this.edit({
        oldName: collection.name,
        newName: this.editedCollection,
      })
      this.tab = temp
    },
    confirmRemoveCollection(collection) {
      this.removedCollection = collection
      this.dialog = true
    },
    removeCollection() {
      this.remove(this.removedCollection.name)
      this.dialog = false
      this.tab = '默认收藏集'
    },
    cancel() {
      this.dialog = false
    },
    init() {
      this.addCollectionSwitch = false
      this.editCollectionSwitchs = new Array(this.collections.length).fill(
        false,
      )
    },
    clickCheckbox() {
      if (this.checkAll) this.checkeds.push(...this.unblackedPosts)
      else
        this.checkeds = this.checkeds.filter(
          post => !this.unblackedPosts.map(post => post.id).includes(post.id),
        )
    },
    clickPost(post) {
      this.openLarger({ post, posts: this.currentCollection.posts })
    },
    download() {
      this.showCheckbox = !this.showCheckbox
      if (!this.showCheckbox) {
        downloadImages(
          this.checkeds.map(post => post.storage.file_url),
          `${this.tab}_${this.checkeds.length}_${moment().format(
            dateDisplayFormat,
          )}`,
        )
        this.checkeds = []
      }
    },
  },
  created() {
    this.init()
  },
}
</script>

<style lang="scss">
#collection {
  .collection-tabs {
    .collection-tab {
      justify-content: flex-start;
    }
    .v-list-item {
      flex: 0 0 auto;
    }
  }
  .v-item-group {
    width: 200px;
  }
  .v-pagination li {
    &:first-child,
    &:last-child {
      display: none;
    }
  }
  .collection-input {
    width: 80px;
  }
  .collection-checkbox {
    height: 100%;
    justify-content: flex-end;
    align-items: flex-end;
  }
}
</style>