// 获取角色列表接口返回数据类型
export interface getRoleListResponseData {
  status: number
  data?: roleInfoData[]
  msg?: string
}
// 服务器返回角色信息中data的数据类型
export interface roleInfoData {
  _id?: string
  name: string
  menus?: string[]
  create_time?: number
  __v?: number
  auth_name?: string
  auth_time?: number
}
