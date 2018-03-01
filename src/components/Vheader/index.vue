<template>
  <header class="header">
    <div class="seller-warpper">
      <div class="seller__logo">
        <img src="./logo.jpg" alt="logo">
      </div>
      <div class="seller__info">
        <div class="seller-info__title">
          <span></span>
        </div>
        <div class="seller-info__delivery"></div>
        <div class="seller-info__title"></div>
      </div>
    </div>
    <div class="notice-warpper"></div>
  </header>
</template>

<script>
export default {
  name: 'Vheader'
}
</script>

<style lang="less" scoped>
  @import '../../assets/css/mix.less';
  header {
    .mixin-font-dpr(10px);
  }
</style>
