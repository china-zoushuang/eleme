<template>
  <nav class="nav">
    <router-link to="goods">商品</router-link>
    <router-link to="comment">评价</router-link>
    <router-link to="seller">商家</router-link>
  </nav>
</template>

<script>
export default {
  name: 'Vnav'
}
</script>

<style lang="less" scoped>
.nav {
  a {

    &.active {
      color: red;
    }
  }
}
</style>
