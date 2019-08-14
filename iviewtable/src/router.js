import Vue from 'vue'
import Router from 'vue-router'
import { Table } from 'iview';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'table1',
      component: () => import('./views/Table1.vue')
    },
  
    {
      path: '/table1',
      component: () => import('./views/Table1.vue')
    },
    {
      path: '/table2',
      component: () => import('./views/Table2.vue')
    },
    {
      path: '/table3',
      component: () => import('./views/Table3.vue')
    },
    {
      path: '/table4',
      component: () => import('./views/Table4.vue')
    },
    {
      path: '/table5',
      component: () => import('./views/Table5.vue')
    },
    {
      path: '/table6',
      component: () => import('./views/Table6.vue')
    }
  ]
})
