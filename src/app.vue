<template>
    <div class='drive-container'>
        <header></header>
        <router-view></router-view>
    </div>
</template>
<script>
    import { Promise } from 'es6-promise';
    import { trim } from 'helpers';

    import ua from 'helpers/ua';
    import Header from './Header';



  export default {
    name: 'App',
    data () {
      return {}
    },
    components: {
        Header
    },
    mounted () {
      this.appShow()
    },
    methods: {
      appShow () {
        const { PAGE_START_TIME } = window
        const END_TIME = new Date().getTime() // 结束时间
        const diffTime = END_TIME - PAGE_START_TIME
        const timer = setTimeout(() => {
          clearTimeout(timer)
          document.querySelector('.app-loading').className += ' app-loading-hide'
        }, diffTime > 2000 ? 0 : 2000 - diffTime)
      }
    }
  }
</script>