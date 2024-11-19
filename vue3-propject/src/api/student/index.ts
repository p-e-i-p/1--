import request from '@/utils/request'
import type {
  studentInfoData,
  studentAllResponseData,
  studentListFormData,
  studentListResponseData,
  studentResponseData,
  studentYearResponseData,
} from './types'
enum API {
  STUDENT_ALL_URL = '/manage/student/all',
  STUDENT_LIST_URL = '/manage/student/list',
  STUDENT_ADD_URL = '/manage/student/add',
  STUDENT_GET_ID_URL = '/manage/student/find',
  STUDENT_UPDATE_URL = '/manage/student/update',
  STUDENT_DELETE_URL = '/manage/student/delete',
  STUDENT_MOUNTH_DATA_URL = '/manage/student/date',
}

// 获取所有学生
export const reqStudentAll = () =>
  request.get<any, studentAllResponseData>(API.STUDENT_ALL_URL)
// 获取学生列表（分页）
export const reqStudentList = (data: studentListFormData) =>
  request.post<any, studentListResponseData>(API.STUDENT_LIST_URL, data)
// 添加学生
export const reqStudentAdd = (data: studentInfoData) =>
  request.post<any, studentResponseData>(API.STUDENT_ADD_URL, data)
// 根据id查询学生
export const reqStudentById = (_id: string) =>
  request.get<any, studentResponseData>(API.STUDENT_GET_ID_URL + `?_id=${_id}`)
// 更新学生信息
export const reqStudentUpdate = (data: studentInfoData) =>
  request.post<any, studentResponseData>(API.STUDENT_UPDATE_URL, data)
// 删除学生
export const reqStudentDelete = (studentId: string) =>
  request.post<any, studentResponseData>(API.STUDENT_DELETE_URL, { studentId })
// 获取某一年每月学员数量
export const reqStudentForYear = (year: number) =>
  request.post<any, studentYearResponseData>(API.STUDENT_MOUNTH_DATA_URL, {
    year,
  })
