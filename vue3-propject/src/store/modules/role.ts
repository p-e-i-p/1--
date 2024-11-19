// 创建角色小仓库
import { defineStore } from 'pinia'
// 引入接口
import { addRole, getRoleList, updateRole } from '@/api/role'
// 引入state返回的对象的类型
import { RoleState } from './types/type'
// 引入数据类型
import type { roleInfoData, getRoleListResponseData } from '@/api/role/types'

// 创建小仓库
const useRoleStore = defineStore('Role', {
  state: (): RoleState => {
    return {
      roles: [],
    }
  },
  actions: {
    async roleList() {
      const result: getRoleListResponseData = await getRoleList()
      if (result.status == 0) {
        this.roles = result.data
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async useAddRole(data: roleInfoData) {
      const result: getRoleListResponseData = await addRole(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async useUpdateRole(data: roleInfoData) {
      const result: getRoleListResponseData = await updateRole(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
// 对外暴露小仓库
export default useRoleStore
