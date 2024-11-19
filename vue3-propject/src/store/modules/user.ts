import { defineStore } from 'pinia'
import {
  reqLogin,
  reqUserAdd,
  reqUserAll,
  reqUserById,
  reqUserDelete,
  reqUserList,
  reqUserUpdate,
} from '@/api/user'
// 引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userAllReponseData,
  userInfoData,
  userListFormData,
  userListReponseData,
} from '@/api/user/type'
import { UserState } from './types/type'
// 创建用户小仓库
const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      // token:localStorage.getItem("VUE3-TOKLEN")
      user: JSON.parse(localStorage.getItem('VUE3-USER') as string),
      users: [],
    }
  },
  // 异步 | 逻辑
  actions: {
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      console.log("login",result);
      
      if (result.status == 0) {
        /* // 使用类型断言确定数据是字符串类型
            this.token = (result.data.token as string)
            // 本地存储token

            localStorage.setItem("VUE3-TOKLEN",(result.data.token as string)) */
        
        this.user = result.data as userInfoData
        // 本地存储
        localStorage.setItem('VUE3-USER', JSON.stringify(this.user))

        // async函数返回一个promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    removeUser() {
      this.user = null
      localStorage.removeItem('VUE3-USER')
    },
    // 获取所有用户
    async getUserAll() {
      const result: userAllReponseData = await reqUserAll()
      if (result.status == 0) {
        this.users = result.data as userInfoData[]
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 获取用户列表（分页）
    async getUserList(data: userListFormData) {
      const result: userListReponseData = await reqUserList(data)
      if (result.status == 0) {
        this.users = result.data?.data as userInfoData[]
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 添加用户
    async addUser(data: userInfoData) {
      const result: loginResponseData = await reqUserAdd(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 根据id查询用户
    async getUserById(_id: string) {
      const result: loginResponseData = await reqUserById(_id)
      if (result.status == 0) {
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 更新用户信息
    async updateUser(data: userInfoData) {
      const result: loginResponseData = await reqUserUpdate(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    // 删除用户
    async deleteUser(userId: string) {
      const result: loginResponseData = await reqUserDelete(userId)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
// 对外暴露
export default useUserStore
