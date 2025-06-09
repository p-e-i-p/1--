// 服务器返回专业信息中data选项的数据类型
export interface majorInfoData{
    _id?:string|null,
    majorname:string,
    value?:string,
    __v?:number
}
// 获取专业列表携带参数数据类型
export interface majorListFormData{
    page:number,
    size:number
}
// 专业信息接口返回数据类型
export interface majorResponseData{
    status:number,
    data?:majorInfoData,
    msg?:string
}
// 获取所有专业接口返回数据类型
export interface majorAllResponseData{
    status:number,
    data?:majorInfoData[],
    msg?:string
}
// 获取专业列表（分页）
export interface majorListResponseData{
    status:number,
    data?:majorListData,
    msg?:string
}
// 专业列表中data类型
interface majorListData{
    data:majorInfoData[],
    total:number
}