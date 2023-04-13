import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/login',
  //   name: 'login',
  //   component: () => import('@/views/Login.vue')
  // },
  // {
  //   path: '/home-page',
  //   name: 'home-page',
  //   component: () => import('@/views/HomePage.vue')
  // },
  {
    path: '/home',
    name: 'home',
    component: HomePage
  },
  {
    path: '/venda',
    name: 'venda',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/VendaBalcao.vue')
  },
  {
    path: '/caixa',
    name: 'caixa',

    component: () => import('@/views/CaixaPagamento.vue')
  },
  {
    path: '/usuarios',
    name: 'usuarios',

    component: () => import('@/views/Usuario.vue')
  },
  {
    path: '/finalizacao-venda',
    name: 'finalizacao-venda',

    component: () => import('@/views/FinalizacaoVenda.vue')
  },
  {
    path: '/produtos',
    name: 'produtos',

    component: () => import('@/views/Produto.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
