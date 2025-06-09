import  type { classInfoData } from "@/api/class/type";
import  type { majorInfoData } from "@/api/major/type";
import  type { roleInfoData } from "@/api/role/type";
import  type { schoolInfoData } from "@/api/school/type";
import  type { studentInfoData } from "@/api/student/type";
import  type { userInfoData } from "@/api/user/type";

// 定义用户小仓库中state的数据类型
export interface UserState{
    // token:string|null
    user:userInfoData | null,
    users:userInfoData[]
}
// 定义角色小仓库中state的数据类型
export interface RoleState{
    roles:roleInfoData[] | undefined
}
// 定义学校小仓库中state的数据类型
export interface SchoolState{
    schools:schoolInfoData[] | undefined
}
// 定义专业小仓库中state的数据类型
export interface MajorState{
    majors:majorInfoData[] | undefined
}
// 定义班级小仓库中state的数据类型
export interface ClassState{
    classes:classInfoData[] | undefined
}
// 定义学员小仓库中state的数据类型
export interface StudentState{
    students:studentInfoData[] | undefined
}