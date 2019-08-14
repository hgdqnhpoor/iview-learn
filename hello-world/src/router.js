import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
       {
          path: '/app',
          name: 'app',
          component: () => import('./views/App.vue')
        },
        {
          path: '/',
          redirect: '/app',
        },
      
        {
          path: '/push',
          name: 'push',
          component: () => import('./views/Push.vue')
        },
        {
          path: '/dev',
          name: 'dev',
          component: () => import('./views/Dev.vue')
        },
        {
          path: '/manage',
          name: 'manage',
          component: () => import('./views/Manage.vue')
        },
  ]
})
