// 角色小仓库
import { defineStore } from "pinia";
import type { RoleState } from "./type/type";
import { addRole, getRoleList, updateRole } from "@/api/role";
import type { addRoleResponseData, getRoleResponseDta, roleInfoData } from "@/api/role/type";
let useRoleStore = defineStore('Role',{
    // 存储角色数据的地方
    state:():RoleState=>{
        return {
            roles:[]
        }
    },
    // 操作数据的方法
    actions:{
        async roleList(){
            // 调用api文件中的发送Ajax请求的方法
            let result:getRoleResponseDta =  await getRoleList()
            if(result.status == 0){
                this.roles = result.data
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        async useAddRole(data:roleInfoData){
            let result:addRoleResponseData = await addRole(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 设置角色权限
        async useUpdateRole(data:roleInfoData){
            let result:addRoleResponseData = await updateRole(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        }
    }
})
// 对外暴露
export default useRoleStore