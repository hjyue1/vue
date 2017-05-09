import Vue from 'vue'
import VueRouter from 'vue-router'
import {routerMode} from 'configs'
import FastClick from 'fastclick'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueRouter)
const router = new VueRouter({
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production'
})


new Vue({
}).$mount('#app')
