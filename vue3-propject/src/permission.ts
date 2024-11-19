import router from './router'
import pinia from './store'
import useUserStore from './store/modules/user'
const userStore = useUserStore(pinia)
router.beforeEach((to, from, next) => {
  from = from
  // 获取user对象
  const user = userStore.user

  // 判断user对象是否存储,并且不是一个空对象
  if (user && user._id) {
    // 如果已经登陆过是不允许再次进入到登录页面
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 非登录页面正常进入
      next()
    }
  } else {
    // 没有登录过,如果要前往登录页面就正常进入
    if (to.path == '/login') {
      next()
    } else {
      // 非登录页面，则强制调整到登录页面进行登录操作
      next({ path: '/login' })
    }
  }
})
