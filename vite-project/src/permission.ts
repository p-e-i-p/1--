//权限校验 通过Router中的前置钩子函数 beforeEach()
// beforeEach((to,_from,next) to为当前页 next下一页面
import router from "./router";
import pinia from "./store";
// 引入用户小仓库
import useUserStore from "./store/modules/user";
let userStore = useUserStore(pinia)
// 设置路由前置钩子函数
router.beforeEach((to,_from,next)=>{
    // 获取用户信息
    const user = userStore.user
    // 如果用户信息存在,证明登录过,并且user不是一个空对象
    if(user && user._id){
        // 如果前往的是登录页面则不允许前往，只能进首页
        if(to.path == "/login"){
            next({path:"/"})
        }else{
            next()
        }
    }else{
        // 没有登录过，就不允许进入除登录页面以外的任何页面
        if(to.path == "/login"){
            next()
        }else{
            next({path:'/login'})
        }

    }
})