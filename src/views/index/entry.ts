import Vue from 'vue'
// import VueRouter from 'vue-router'
import Home from '@/views/index/Home.vue'
import FastClick from 'fastclick'
// require('es6-promise').polyfill()
Vue.config.productionTip = false;

// console.log(FastClick)
var fc: any = FastClick
fc.attach(document.body)
// FastClick.attach(document.body)

import router from '@/router/index'
import store from '@/store/index/index'
/* 全局导航钩子*/
router.beforeEach((to, from, next) => {
    if (to.meta.docTitle) window.document.title = to.meta.docTitle;
    next();
})

import {ToastPlugin,ConfirmPlugin} from 'vux'
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)

new Vue({
    router,
    store,
    render: h => h(Home)
}).$mount('#app-box')
