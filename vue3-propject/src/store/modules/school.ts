import { defineStore } from 'pinia'
import {
  reqSchoolAdd,
  reqSchoolAll,
  reqSchoolById,
  reqSchoolDelete,
  reqSchoolList,
  reqSchoolUpdate,
} from '@/api/school'
import type {
  schoolInfoData,
  schoolAllResponseData,
  schoolListFormData,
  schoolListResponseData,
  schoolResponseData,
} from '@/api/school/types'
import { SchoolState } from './types/type'
// 创建学校小仓库
const useSchoolStore = defineStore('School', {
  state: (): SchoolState => {
    return {
      schools: [],
    }
  },
  actions: {
    async getSchoolAll() {
      const result: schoolAllResponseData = await reqSchoolAll()
      if (result.status == 0) {
        this.schools = result.data as schoolInfoData[]
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getSchoolList(data: schoolListFormData) {
      const result: schoolListResponseData = await reqSchoolList(data)
      if (result.status == 0) {
        this.schools = result.data?.data as schoolInfoData[]
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async addSchool(data: schoolInfoData) {
      const result: schoolResponseData = await reqSchoolAdd(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getSchoolById(_id: string) {
      const result: schoolResponseData = await reqSchoolById(_id)
      if (result.status == 0) {
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async updateSchool(data: schoolInfoData) {
      const result: schoolResponseData = await reqSchoolUpdate(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async deleteSchool(schoolId: string) {
      const result: schoolResponseData = await reqSchoolDelete(schoolId)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
export default useSchoolStore
