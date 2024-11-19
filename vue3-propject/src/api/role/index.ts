import request from '@/utils/request'
import type { getRoleListResponseData, roleInfoData } from './types'

// 获取角色列表
export const getRoleList = () =>
  request.get<any, getRoleListResponseData>('/manage/role/list')
// 添加角色
export const addRole = (data: roleInfoData) =>
  request.post<any, getRoleListResponseData>('/manage/role/add', data)
// 设置角色权限
export const updateRole = (data: roleInfoData) =>
  request.post<any, getRoleListResponseData>('/manage/role/update', data)
