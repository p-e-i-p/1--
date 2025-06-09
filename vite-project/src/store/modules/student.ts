// 创建学员小仓库
import { defineStore } from "pinia";
// 引入state函数返回数据类型
import type { StudentState } from "./type/type";
import type { studentAllResponseData, studentInfoData, studentListFormData, studentListResponseData, studentResponseData } from "@/api/student/type";
import { reqStudentAdd, reqStudentAll, reqStudentById, reqStudentDelete, reqStudentList, reqStudentUpdate } from "@/api/student";
// 创建仓库
let useStudentStore = defineStore("Student",{
    state:():StudentState=>{
        return{
            students:[]
        }
    },
    actions:{
        // 获取所有学员
        async getStudentAll(){
            let result:studentAllResponseData = await reqStudentAll()
            if(result.status == 0){
                this.students = result.data as studentInfoData[]
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 获取学员列表（分页）
        async getStudentList(data:studentListFormData){
            let result:studentListResponseData = await reqStudentList(data)
            if(result.status == 0){
                this.students = result.data?.data as studentInfoData[]
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 添加学员
        async addStudent(data:studentInfoData){
            let result:studentResponseData = await reqStudentAdd(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更加id获取学员信息
        async getStudentById(_id:string){
            let result:studentResponseData = await reqStudentById(_id)
            if(result.status == 0){
                return result.data
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 更新学员信息
        async updateStudent(data:studentInfoData){
            let result:studentResponseData = await reqStudentUpdate(data)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
        // 删除学员
        async deleteStudent(studentId:string){
            let result:studentResponseData = await reqStudentDelete(studentId)
            if(result.status == 0){
                return 'OK'
            }else{
                return Promise.reject(new Error(result.msg))
            }
        },
    }
})
export default useStudentStore