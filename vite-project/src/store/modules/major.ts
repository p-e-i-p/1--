// 创建专业小仓库
import { defineStore } from "pinia";
// 引入state函数返回数据类型
import type { MajorState } from "./type/type";
import type { majorAllResponseData, majorInfoData, majorListFormData, majorListResponseData, majorResponseData } from "@/api/major/type";
import { reqMajorAdd, reqMajorAll, reqMajorById, reqMajorDelete, reqMajorList, reqMajorUpdate } from "@/api/major";
// 创建仓库
let useMajorStore = defineStore("Major",{
    state:():MajorState=>{
        return{
            majors:[]
        }
    },
    actions:{
        // 获取所有专业
        async getMajorAll(){
            let result:majorAllResponseData = await reqMajorAll()
            if(result.status == 0){
                this.majors = result.data as majorInfoData[]
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 获取专业列表（分页）
        async getMajorList(data:majorListFormData){
            let result:majorListResponseData = await reqMajorList(data)
            if(result.status == 0){
                this.majors = result.data?.data as majorInfoData[]
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 添加专业
        async addMajor(data:majorInfoData){
            let result:majorResponseData = await reqMajorAdd(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更加id获取专业信息
        async getMajorById(_id:string){
            let result:majorResponseData = await reqMajorById(_id)
            if(result.status == 0){
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更新专业信息
        async updateMajor(data:majorInfoData){
            let result:majorResponseData = await reqMajorUpdate(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 删除专业
        async deleteMajor(majorId:string){
            let result:majorResponseData = await reqMajorDelete(majorId)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
    }
})
export default useMajorStore