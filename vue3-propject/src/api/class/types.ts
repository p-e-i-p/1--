// 后端返回班级信息中data选项的数据类型
export interface classInfoData {
  _id?: string
  classname: string
  teacher_id: string
  manager_id: string
  __v?: number
}
// 获取班级列表接口需要携带的数据类型
export interface classListFormData {
  page: number
  size: number
  searchMap: searchMapData
}
// 班级条件查询中searchMap的数据类型
interface searchMapData {
  teacher_id?: string
  manager_id?: string
}
// 班级信息接口返回数据类型
export interface classResponseData {
  status: number
  data?: classInfoData
  msg?: string
}
// 获取所有班级接口返回数据类型
export interface classAllResponseData {
  status: number
  data?: classInfoData[]
  msg?: string
}
// 获取班级列表接口返回数据类型
export interface classListResponseData {
  status: number
  data?: classListData
  msg?: string
}
// 班级列表data数据类型
interface classListData {
  data: classInfoData[]
  total: number
}
