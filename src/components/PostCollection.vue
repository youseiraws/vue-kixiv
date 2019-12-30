<template>
  <div id="post-collection">
    <v-list dense>
      <v-hover #default="{hover}" v-for="(collection,index) in collections" :key="collection.name">
        <v-list-item v-if="editCollectionSwitchs[index]">
          <v-text-field
            v-model="editedCollection"
            dense
            solo
            single-line
            autofocus
            append-outer-icon="mdi-check-circle-outline"
            @click:append-outer="editCollection(collection,index)"
            @keyup.enter="editCollection(collection,index)"
          ></v-text-field>
        </v-list-item>
        <v-list-item v-else @click="selectCollection(collection)">
          <v-list-item-icon>
            <v-icon
              v-if="collection.posts.map(post=>post.id).includes(post.id)"
              color="yellow"
            >mdi-star</v-icon>
            <v-icon v-else>mdi-star-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>
            {{collection.name}}
            <span class="grey--text pl-1">{{collection.posts.length}}</span>
          </v-list-item-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            v-show="collection.name!=='默认收藏集'&&hover"
            @click.stop="switchEditCollection(collection,index)"
          >
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            v-show="collection.name!=='默认收藏集'&&hover"
            @click.stop="confirmRemoveCollection(collection)"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </v-list-item>
      </v-hover>
      <v-list-item v-if="addCollectionSwitch">
        <v-text-field
          v-model="addedCollection"
          dense
          solo
          single-line
          autofocus
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
    </v-list>
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
import { createNamespacedHelpers } from 'vuex'

const { mapGetters, mapActions } = createNamespacedHelpers('collection')

export default {
  name: 'PostCollection',
  props: {
    post: {
      type: Object,
      default() {
        return {}
      },
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      addCollectionSwitch: false,
      editCollectionSwitchs: [],
      addedCollection: '',
      editedCollection: '',
      removedCollection: {},
      dialog: false,
    }
  },
  computed: {
    ...mapGetters(['collections']),
  },
  watch: {
    collections(newCollections) {
      this.editCollectionSwitchs = new Array(newCollections.length).fill(false)
    },
    menu(newMenu) {
      if (!newMenu) this.init()
    },
  },
  methods: {
    ...mapActions({
      add: 'ADD',
      edit: 'EDIT',
      remove: 'REMOVE',
      like: 'LIKE',
      dislike: 'DISLIKE',
    }),
    selectCollection(collection) {
      if (collection.posts.map(post => post.id).includes(this.post.id))
        this.dislike({ name: collection.name, id: this.post.id })
      else this.like({ name: collection.name, id: this.post.id })
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
    editCollection(collection, index) {
      this.editCollectionSwitchs.splice(index, 1, false)
      this.edit({ oldName: collection.name, newName: this.editedCollection })
    },
    confirmRemoveCollection(collection) {
      this.$emit('dialog-opened')
      this.removedCollection = collection
      this.dialog = true
    },
    removeCollection() {
      this.remove(this.removedCollection.name)
      this.dialog = false
      this.$emit('dialog-closed')
    },
    cancel() {
      this.dialog = false
      this.$emit('dialog-closed')
    },
    init() {
      this.addCollectionSwitch = false
      this.editCollectionSwitchs = new Array(this.collections.length).fill(
        false,
      )
    },
  },
  created() {
    this.init()
  },
}
</script>

<style>
</style>