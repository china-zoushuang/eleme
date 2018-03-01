<template>
  <div id="app">
    <v-header></v-header>
    <v-nav></v-nav>
    <router-view/>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import Vheader from '@/components/Vheader'
  import Vnav from '@/components/Vnav'
  import Vfooter from '@/components/Vfooter'
  import apis from '@/utils/api'
  export default {
    name: 'App',
    components: {
      'v-header': Vheader,
      'v-footer': Vfooter,
      'v-nav': Vnav
    },
    created () {
      apis.getData()
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>

<style>
  @import './assets/css/common.less';
  @import './assets/css/reset.css';
</style>
