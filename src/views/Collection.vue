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
      <v-tab class="collection-tab" :href="`#${tagManagement.name}`">
        {{tagManagement.name}}
        <span class="grey--text ml-2">{{tagManagement.tags.length}}</span>
      </v-tab>
      <v-tab class="collection-tab" :href="`#${blacklist.name}`">
        {{blacklist.name}}
        <span class="grey--text ml-2">{{blacklist.posts.length}}</span>
      </v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="collection in totalCollections"
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
                v-show="showCheckbox&&isCollectionTab"
                v-model="checkAll"
                label="全选"
                hide-details
                @change="clickCheckbox"
              ></v-checkbox>
            </template>
            <template #header-action>
              <v-btn v-show="isCollectionTab" light outlined @click="download()">下载</v-btn>
            </template>
            <template #content>
              <post
                v-for="post in currentPosts"
                :key="post.id"
                :show-blacked="isBlacklistTab"
                :width="301"
                :post="post"
                :disabled="showCheckbox"
                @post-clicked.self="clickPost(post)"
              >
                <template #action>
                  <v-checkbox
                    class="collection-checkbox"
                    v-show="showCheckbox&&isCollectionTab"
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
        <v-tab-item :value="tagManagement.name">
          <container
            :gap="64"
            :columns="5"
            :is-show-footer-left-indicator="hasPrevPage"
            :is-show-footer-right-indicator="hasNextPage"
            :is-show-refresh="false"
            @footer-left-indicator-click="prevCollection"
            @footer-right-indicator-click="nextCollection"
          >
            <template #header-action>
              <div class="d-inline-flex">
                <v-menu offset-y transition="scroll-y-transition">
                  <template #activator="{on}">
                    <v-btn light outlined v-on="on" :color="tagType.color">{{tagType.name}}</v-btn>
                  </template>
                  <template>
                    <v-list>
                      <v-list-item-group v-model="tagType" mandatory>
                        <v-list-item
                          v-for="tagType in tagTypes"
                          :key="tagType.value"
                          :value="tagType"
                        >
                          <v-list-item-title :style="{color:tagType.color}">{{tagType.name}}</v-list-item-title>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </template>
                </v-menu>
              </div>
            </template>
            <template #content>
              <cover
                v-for="tag in currentTags"
                :key="tag.id"
                :width="194"
                :cover="categories[tag.name]"
                @click="clickCover(tag.name)"
              >
                <div :style="{color:getTagColor(tag)}">{{tag.name}}</div>
                <div class="white--text">{{tag.count}}</div>
                <v-btn icon @click.stop="untag(tag.id)">
                  <v-icon color="yellow">mdi-star</v-icon>
                </v-btn>
              </cover>
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
import { Container, Post, Cover } from '../components'
import { tagTypes, getTagColor, downloadImages } from '../util/util'

const dateDisplayFormat = 'YYYYMMDD-HHmmss'
const BLACKLIST = '黑名单'
const TAG_MANAGEMENT = '标签管理'

export default {
  name: 'Collection',
  components: {
    Container,
    Post,
    Cover,
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
      tagTypes,
      tagType: {
        name: 'any',
        value: '',
        color: '#000000',
      },
    }
  },
  computed: {
    ...mapGetters('collection', [
      'collections',
      'blacklist',
      'tagManagement',
      'categories',
      'isLoading',
    ]),
    ...mapGetters('setting', ['pageSize']),
    totalCollections() {
      if (this.collections !== undefined && this.blacklist !== undefined)
        return [...this.collections, this.blacklist]
    },
    isCollectionTab() {
      return this.tab !== BLACKLIST && this.tab !== TAG_MANAGEMENT
    },
    isBlacklistTab() {
      return this.tab === BLACKLIST
    },
    isTagManagementTab() {
      return this.tab === TAG_MANAGEMENT
    },
    currentCollection() {
      if (!this.isTagManagementTab) {
        if (this.totalCollections !== undefined)
          return this.totalCollections.find(
            collection => collection.name === this.tab,
          )
      } else return this.tagManagement
    },
    currentPosts() {
      if (this.currentCollection === undefined && this.isTagManagementTab)
        return []
      return this.currentCollection.posts.slice(
        (this.pagination - 1) * this.pageSize,
        this.pagination * this.pageSize,
      )
    },
    currentTags() {
      if (this.currentCollection === undefined && !this.isTagManagementTab)
        return []
      return this.currentCollection.tags.slice(
        (this.pagination - 1) * this.pageSize,
        this.pagination * this.pageSize,
      )
    },
    currentLength() {
      if (this.currentCollection === undefined) return 0
      return Math.ceil(
        this.currentCollection[!this.isTagManagementTab ? 'posts' : 'tags']
          .length / this.pageSize,
      )
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
      this.showCheckbox = false
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
    tagManagement(newTagManagement) {
      this.loadCover()
    },
  },
  methods: {
    ...mapActions('collection', {
      add: 'ADD',
      edit: 'EDIT',
      remove: 'REMOVE',
      like: 'LIKE',
      dislike: 'DISLIKE',
      untag: 'UNTAG',
      loadCover: 'LOAD_COVER',
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
      this.loadCover()
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
    getTagColor(tag) {
      return getTagColor(tag)
    },
    clickCover(name) {
      this.$router.push({ name: 'tag', params: { name } })
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