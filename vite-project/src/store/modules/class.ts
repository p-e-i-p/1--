// 创建班级小仓库
import { defineStore } from "pinia";
// 引入state函数返回数据类型
import type { ClassState } from "./type/type";
import type { classAllResponseData, classInfoData, classListFormData, classListResponseData, classResponseData } from "@/api/class/type";
import { reqClassAdd, reqClassAll, reqClassById, reqClassDelete, reqClassList, reqClassUpdate } from "@/api/class";
// 创建仓库
let useClassStore = defineStore("Class",{
    state:():ClassState=>{
        return{
            classes:[]
        }
    },
    actions:{
        // 获取所有班级
        async getClassAll(){
            let result:classAllResponseData = await reqClassAll()
            if(result.status == 0){
                this.classes = result.data as classInfoData[]
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 获取班级列表（分页）
        async getClassList(data:classListFormData){
            let result:classListResponseData = await reqClassList(data)
            if(result.status == 0){
                this.classes = result.data?.data as classInfoData[]
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 添加班级
        async addClass(data:classInfoData){
            let result:classResponseData = await reqClassAdd(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更加id获取班级信息
        async getClassById(_id:string){
            let result:classResponseData = await reqClassById(_id)
            if(result.status == 0){
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更新班级信息
        async updateClass(data:classInfoData){
            let result:classResponseData = await reqClassUpdate(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 删除班级
        async deleteClass(classId:string){
            let result:classResponseData = await reqClassDelete(classId)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
    }
})
export default useClassStore