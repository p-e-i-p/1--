import { defineStore } from 'pinia'
import {
  reqStudentAdd,
  reqStudentAll,
  reqStudentById,
  reqStudentDelete,
  reqStudentList,
  reqStudentUpdate,
} from '@/api/student'
import type {
  studentInfoData,
  studentAllResponseData,
  studentListFormData,
  studentListResponseData,
  studentResponseData,
} from '@/api/student/types'
import { StudentState } from './types/type'
// 创建学生小仓库
const useStudentStore = defineStore('Student', {
  state: (): StudentState => {
    return {
      students: [],
    }
  },
  actions: {
    async getStudentAll() {
      const result: studentAllResponseData = await reqStudentAll()
      if (result.status == 0) {
        this.students = result.data as studentInfoData[]
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getStudentList(data: studentListFormData) {
      const result: studentListResponseData = await reqStudentList(data)
      if (result.status == 0) {
        this.students = result.data?.data as studentInfoData[]
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async addStudent(data: studentInfoData) {
      const result: studentResponseData = await reqStudentAdd(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async getStudentById(_id: string) {
      const result: studentResponseData = await reqStudentById(_id)
      if (result.status == 0) {
        return result.data
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async updateStudent(data: studentInfoData) {
      const result: studentResponseData = await reqStudentUpdate(data)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
    async deleteStudent(studentId: string) {
      const result: studentResponseData = await reqStudentDelete(studentId)
      if (result.status == 0) {
        return 'OK'
      } else {
        return Promise.reject(new Error(result.msg))
      }
    },
  },
})
export default useStudentStore
