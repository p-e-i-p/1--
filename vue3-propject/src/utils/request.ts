import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
// 引入用户小仓库
import useUserStore from '@/store/modules/user.ts'

// 加载效果对象
const loading = {
  // 加载效果的实例对象
  loadingInstance: null,
  open() {
    if (this.loadingInstance == null) {
      this.loadingInstance = ElLoading.service({
        target: '.main',
        text: '拼命加载中...',
        background: 'rgba(0,0,0,0.5)',
      })
    }
  },
  close() {
    if (this.loadingInstance != null) {
      this.loadingInstance.close()
    }
    this.loadingInstance = null
  },
}

// 创建axios实例
const request = axios.create({
  // baseURL:'/mock',
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 获取权限列表\
const getMenus = () => {
  // 用户小仓库
  const userStore = useUserStore()
  // 当前登录的角色id
  const roleId = userStore.user?.role_id
  // 当前登录的用户权限列表（本地存储）
  const userMenus = userStore.user?.role?.menus
  // 如果是超级管理员
  if (userStore.user.username == 'admin') {
    return
  }

  // 发送请求根据当前登录的角色id获取最新的权限列表然后进行比较
  request({
    url: '/menus',
    method: 'post',
    data: {
      roleId,
    },
  }).then((response) => {
    const resp = response
    if (resp.status == 0) {
      // mongod数据库中的权限列表
      const menus = resp.data.menus
      if (userMenus?.length == menus.length) {
        userMenus?.forEach((item) => {
          if (menus.indexOf(item) == -1) {
            userStore.removeUser()
            ElMessage({
              message: '当前登录的用户权限被修改，请重新登录！',
              type: 'warning',
            })
            // 跳转到登录页面
            window.location.href = '/login'
          }
        })
      } else {
        userStore.removeUser()
        ElMessage({
          message: '当前登录的用户权限被修改，请重新登录！',
          type: 'warning',
        })
        // 跳转到登录页面
        window.location.href = '/login'
      }
    }
    return
  })
}
// 请求拦截器
request.interceptors.request.use(

  function (config) {
    
    // Do something before request is sent
    if (config.url != '/menus' && config.url != '/login') {
      // 开启加载效果
      loading.open()
      getMenus()
    }
    // 用户小仓库
    const userStore = useUserStore()
    config.headers.token = userStore.user?.token
    return config
  },
  function (error) {
    loading.close()
    // Do something with request error
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const resp = response.data
    if (resp.status != 0) {
      ElMessage({
        message: resp.msg,
        type: 'warning',
      })
    }
    loading.close()
    return response.data
  },
  function (error) {
    console.log("error",error);
    
    // 失败的回调函数，里面处理http网络错误
    // 用来存储网络的错误信息
    let msg = ''
    // http状态码
    const status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器错误'
        break

      default:
        msg = '网络已关闭'
        break
    }
    ElMessage({
      message: msg,
      type: 'error',
    })
    loading.close()
    return Promise.reject(error)
  },
)

//   将创建的axios对象对外暴露出去
export default request
