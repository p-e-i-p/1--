// 用户小仓库
import { defineStore } from "pinia";
// 引入数据类型
import type { loginFormData,loginResponseData,userAllResponseData,userInfoData, userListFormData, userListResponseData } from "@/api/user/type";
// 引入api方法
import { reqLogin, reqUserAdd, reqUserAll, reqUserById, reqUserList, reqUserUpdate,reqUserDelete } from "@/api/user";
// 引入state数据类型
import type { UserState } from "./type/type";
// 创建用户小仓库
let useUserStore = defineStore("User",{
    // 状态（存储数据的地方）
    state:():UserState=>{
        return{
            // token:localStorage.getItem("b0415-token")
            user:JSON.parse(localStorage.getItem('B0415-VUE3-USER') as string),
            users:[]
        }
    },
    // 发送异步请求的方法，一些逻辑处理方法
    actions:{
        async userLogin(data:loginFormData){
            let result:loginResponseData = await reqLogin(data)
            if(result.status == 0){
               /*  // 改变pinia仓库中存储的token
                this.token = result.data?.token as string
                // 改变localStorage当中存储的token值
                localStorage.setItem("b0415-token",this.token) */
                this.user = result.data as userInfoData
                localStorage.setItem('B0415-VUE3-USER',JSON.stringify(result.data))
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
            
        },
        removeUser(){
            this.user = null
            localStorage.removeItem('B0415-VUE3-USER')
        },
        // 获取所有用户
        async getUserAll(){
            let result:userAllResponseData = await reqUserAll()
            if(result.status == 0){
                this.users = result.data as userInfoData[]
                 return 'OK'
             }else{
                 return Promise.reject(new Error(result.msg))
             }
        },
        // 获取用户列表(分页)
        async getUserList(data:userListFormData){
            let result:userListResponseData = await reqUserList(data)
            if(result.status == 0){
                this.users = result.data?.data as userInfoData[]
                 return result.data
             }else{
                 return Promise.reject(new Error(result.msg))
             }
        },
        // 添加用户
        async addUser(data:userInfoData){
            let result:loginResponseData = await reqUserAdd(data)
            if(result.status == 0){
                 return 'OK'
             }else{
                 return Promise.reject(new Error(result.msg))
             }
        },
        // 根据_id查询用户
        async getUserById(_id:string){
            let result:loginResponseData = await reqUserById(_id)
            if(result.status == 0){
                 return result.data
             }else{
                 return Promise.reject(new Error(result.msg))
             }
        },
        // 更新用户信息
        async updateUser(data:userInfoData){
            let result:loginResponseData = await reqUserUpdate(data)
            if(result.status == 0){
                 return 'OK'
             }else{
                 return Promise.reject(new Error(result.msg))
             }
        },
        // 删除用户信息
        async deleteUser(userId:string){
            let result:loginResponseData = await reqUserDelete(userId)
            if(result.status == 0){
                 return 'OK'
             }else{
                 return Promise.reject(new Error(result.msg))
             }
        }


    }
})
export default useUserStore