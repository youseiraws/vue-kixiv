import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  Latest,
  Random,
  Popular,
  Category,
  Tag,
  Setting,
  Collection,
} from '../views'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'latest' },
  },
  {
    path: '/latest',
    name: 'latest',
    component: Latest,
  },
  {
    path: '/random',
    name: 'random',
    component: Random,
  },
  {
    path: '/popular',
    name: 'popular',
    component: Popular,
  },
  {
    path: '/category',
    name: 'category',
    component: Category,
  },
  {
    path: '/tag/:name',
    name: 'tag',
    component: Tag,
    props: true,
  },
  {
    path: '/collection',
    name: 'collection',
    component: Collection,
  },
  {
    path: '/setting',
    name: 'setting',
    component: Setting,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
