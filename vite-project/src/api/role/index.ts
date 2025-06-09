// 引入自己封装的axios对象
import request from "@/utils/request";
import type { addRoleResponseData, getRoleResponseDta,roleInfoData } from "./type";

enum API{
    ROLELIST_URL = "/manage/role/list",
    ADDROLE_URL = "/manage/role/add",
    UPDATEROLE_URL="/manage/role/update"
}
// 获取角色列表
export const getRoleList = () => request.get<any,getRoleResponseDta>(API.ROLELIST_URL)
// 添加角色
export const addRole = (data:roleInfoData)=>request.post<any,addRoleResponseData>(API.ADDROLE_URL,data)
// 设置角色权限
export const updateRole = (data:roleInfoData)=>request.post<any,addRoleResponseData>(API.UPDATEROLE_URL,data)