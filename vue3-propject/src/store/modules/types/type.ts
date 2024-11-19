// 定义小仓数据state的类型
import type { userInfoData } from '@/api/user/type'
import type { roleInfoData } from '@/api/role/types'
import type { schoolInfoData } from '@/api/school/types'
import type { majorInfoData } from '@/api/major/types'
import type { classInfoData } from '@/api/class/types'
import type { studentInfoData } from '@/api/student/types'
export interface UserState {
  // token:string|null
  user: userInfoData | null
  users: userInfoData[]
}
export interface RoleState {
  roles: roleInfoData[] | undefined
}
export interface SchoolState {
  schools: schoolInfoData[] | undefined
}
export interface MajorState {
  majors: majorInfoData[] | undefined
}
export interface ClassState {
  classes: classInfoData[] | undefined
}
export interface StudentState {
  students: studentInfoData[] | undefined
}
