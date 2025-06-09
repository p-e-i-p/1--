// 登录接口需要携带参数ts类型

export interface loginFormData {
  username: string
  password: string
}
// 登录接口返回数据类型data选项的数据类型
interface dataType {
    token?: string
}
// 登录接口返回数据类型
export interface loginResponseData {
  status: number
  data?: userInfoData
  msg?: string
}
// 角色数据类型
interface userRoleData {
  _id?: string
  name?: string
  menus: string[]
  create_time?: number
  __v?: number
  auth_time?: number
  auth_name?: string
}

// 服务器返回用户信息中data选项的数据类型
export interface userInfoData {
  token?: string
  _id: string
  username: string
  name: string
  password: string
  phone?: string
  role_id: string
  create_time?: number
  __v?: number
  role?: userRoleData
}
// 服务器返回用户信息的数据类型
export interface userInfoReponseData {
  status: 0
  data: userInfoData
}
// 校验与修改密码请求需要携带数据的数据类型
export interface pwdData {
  userId: string
  password: string
}

// 校验密码接口返回值数据类型
export interface checkPwdResponseData {
  status: number
  data?: userInfoData
  msg?: string
}
// 获取用户列表接口需要携带参数数据类型
export interface userListFormData {
  page: number
  size: number
}
// 获取所有用户接口返回数据类型
export interface userAllReponseData {
  status: number
  data?: userInfoData[]
  msg?: string
}
// 获取用户列表接口（分页）数据类型
export interface userListReponseData {
  status: number
  data?: userListData
  msg?: string
}
// 用户列表data数据类型
interface userListData {
  data: userInfoData[]
  roles: []
  total: number
}
