// 获取角色列表返回值数据类型
export interface getRoleResponseDta{
    status:number,
    data?:roleInfoData[],
    msg?:string
}
// 单个角色对象数据类型
export interface roleInfoData{
    _id?:string,
    name:string,
    menus?:string[],
    create_time?:number,
    __v?:number,
    auth_time?:number,
    auth_name?:string
}
// 添加角色返回数据类型
export interface addRoleResponseData{
    status:number,
    data?:roleInfoData,
    msg?:string
}