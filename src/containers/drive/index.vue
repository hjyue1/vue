<template>
  <div>
    <nav class="nav">
      <ul flex="box:mean">
        <li :class="{ active: !this.$route.query.tab }">
          <router-link to="/">全部</router-link>
        </li>
        <li :class="{ active: this.$route.query.tab == 'good' }">
          <router-link to="/?tab=good">精华</router-link>
        </li>
        <li :class="{ active: this.$route.query.tab == 'share' }">
          <router-link to="/?tab=share">分享</router-link>
        </li>
        <li :class="{ active: this.$route.query.tab == 'ask' }">
          <router-link to="/?tab=ask">问答</router-link>
        </li>
        <li :class="{ active: this.$route.query.tab == 'job' }">
          <router-link to="/?tab=job">招聘</router-link>
        </li>
      </ul>
    </nav>
    <v-content v-scroll-record>
        <span>123</span>
        <v-loading :complete="complete" :loading="loading" @seeing="seeing"></v-loading>
    </v-content>
    <v-footer></v-footer>
  </div>
</template>
<script>
  export default {
    methods: {
      _pullList () {
        var { page, $route } = this
        var { tab = 'all' } = $route.query
        return {
          url: 'topics',
          data: { page, tab }
        }
      }
    }
  }
</script>