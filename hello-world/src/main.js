import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
Vue.use(iView)
Vue.config.productionTip = false
import devArticle from './components/dev-article.vue'
Vue.component('dev-article',devArticle)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
