import { defineStore } from 'pinia'
import {
  reqClassAdd,
  reqClassAll,
  reqClassById,
  reqClassDelete,
  reqClassList,
  reqClassUpdate,
} from '@/api/class'
import type {
  classInfoData,
  classAllResponseData,
  classListFormData,
  classListResponseData,
  classResponseData,
} from '@/api/class/types'
import { ClassState } from './types/type'
// 创建班级小仓库
const useClassStore = defineStore('Class', {
  state: (): ClassState => {
    return {
      classes: [],
    }
  },
  actions: {
    async getClassAll() {
      const result: classAllResponseData = await reqClassAll()
      if (result.status == 0) {
        this.classes = result.data as classInfoData[]
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getClassList(data: classListFormData) {
      const result: classListResponseData = await reqClassList(data)
      if (result.status == 0) {
        this.classes = result.data?.data as classInfoData[]
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async addClass(data: classInfoData) {
      const result: classResponseData = await reqClassAdd(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getClassById(_id: string) {
      const result: classResponseData = await reqClassById(_id)
      if (result.status == 0) {
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async updateClass(data: classInfoData) {
      const result: classResponseData = await reqClassUpdate(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async deleteClass(classId: string) {
      const result: classResponseData = await reqClassDelete(classId)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
export default useClassStore
