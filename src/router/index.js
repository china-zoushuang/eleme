import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'goods',
      component: r => require.ensure([], () => r(require('@/components/goods')), 'goods')
    },
    {
      path: '/comment',
      name: 'comment',
      component: r => require.ensure([], () => r(require('@/components/comment')), 'comment')
    },
    {
      path: '/seller',
      name: 'seller',
      component: r => require.ensure([], () => r(require('@/components/seller')), 'seller')
    }
  ]
})
