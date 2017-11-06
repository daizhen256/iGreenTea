// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//使用babel转码器把ES6代码转化为ES5代码，有些代码转不了，就需要用到babel-polyfill
import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
//饿了么UI库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
//import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import Mock from './mock'
Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  //el: '#app',
  router,
  //store,
  //template: '<App/>',
  //components: { App }
  render: h => h(App)
}).$mount('#app')
