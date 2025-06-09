// 创建学校小仓库
import { defineStore } from "pinia";
// 引入state函数返回数据类型
import type { SchoolState } from "./type/type";
import type { schoolAllResponseData, schoolInfoData, schoolListFormData, schoolListResponseData, schoolResponseData } from "@/api/school/type";
import { reqSchoolAdd, reqSchoolAll, reqSchoolById, reqSchoolDelete, reqSchoolList, reqSchoolUpdate } from "@/api/school";
// 创建仓库
let useSchoolStore = defineStore("School",{
    state:():SchoolState=>{
        return{
            schools:[]
        }
    },
    actions:{
        // 获取所有学校
        async getSchoolAll(){
            let result:schoolAllResponseData = await reqSchoolAll()
            if(result.status == 0){
                this.schools = result.data as schoolInfoData[]
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 获取学校列表（分页）
        async getSchoolList(data:schoolListFormData){
            let result:schoolListResponseData = await reqSchoolList(data)
            if(result.status == 0){
                this.schools = result.data?.data as schoolInfoData[]
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 添加学校
        async addSchool(data:schoolInfoData){
            let result:schoolResponseData = await reqSchoolAdd(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更加id获取学校信息
        async getSchoolById(_id:string){
            let result:schoolResponseData = await reqSchoolById(_id)
            if(result.status == 0){
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更新学校信息
        async updateSchool(data:schoolInfoData){
            let result:schoolResponseData = await reqSchoolUpdate(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 删除学校
        async deleteSchool(schoolId:string){
            let result:schoolResponseData = await reqSchoolDelete(schoolId)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
    }
})
export default useSchoolStore