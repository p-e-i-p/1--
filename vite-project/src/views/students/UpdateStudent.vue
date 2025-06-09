<template>
    <div class="student-update">
        <el-form
            ref="studentFormRef"
            :model="updateStudent"
            status-icon
            :rules="rules"
            label-width="100px"
            label-position="right"
            style="width: 100%; height: 100%">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="updateStudent.name" />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-select
                    v-model="updateStudent.gender"
                    placeholder="请选择性别"
                    clearable>
                    <el-option
                        v-for="item in genderOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="所在学校" prop="school">
                <el-autocomplete
                    v-model="updateStudent.school"
                    :fetch-suggestions="querySearchSchool"
                    clearable
                    class="inline-input w-50"
                    placeholder="请输入学校" />
            </el-form-item>
            <el-form-item label="专业" prop="major">
                <el-autocomplete
                    v-model="updateStudent.major"
                    :fetch-suggestions="querySearchMajor"
                    clearable
                    class="inline-input w-50"
                    placeholder="请输入专业" />
            </el-form-item>
            <el-form-item label="年级" prop="grade">
                <el-select
                    v-model="updateStudent.grade"
                    placeholder="请选择年级"
                    clearable>
                    <el-option
                        v-for="item in gradeOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="学历" prop="education">
                <el-select
                    v-model="updateStudent.education"
                    placeholder="请选择学历"
                    clearable>
                    <el-option
                        v-for="item in educationOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="学习方向" prop="direction">
                <el-select
                    v-model="updateStudent.direction"
                    placeholder="根据学习方向查询"
                    clearable>
                    <el-option
                        v-for="item in directionOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="身份号码" prop="id_number">
                <el-input v-model="updateStudent.id_number" />
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
                <el-input v-model="updateStudent.phone" />
            </el-form-item>
            <el-form-item label="家长姓名" prop="parent">
                <el-input v-model="updateStudent.parent" />
            </el-form-item>
            <el-form-item label="家长联系电话" prop="parent_phone">
                <el-input v-model="updateStudent.parent_phone" />
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
                <el-input v-model="updateStudent.address" />
            </el-form-item>
            <el-form-item label="QQ号码" prop="qq">
                <el-input v-model="updateStudent.qq" />
            </el-form-item>
            <el-form-item label="所在班级" prop="class">
                <el-select
                    v-model="updateStudent.class"
                    placeholder="请选择班级"
                    clearable>
                    <el-option
                        v-for="item in classOptions"
                        :label="item.classname"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="入学时间" prop="admission_date">
                <el-date-picker
                    v-model="updateStudent.admission_date"
                    type="date"
                    placeholder="请选择入学时间"
                    value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="授课教师" prop="teacher_id">
                <el-select
                    v-model="updateStudent.teacher_id"
                    placeholder="请选择授课教师"
                    clearable>
                    <el-option
                        v-for="item in teacherOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="学管" prop="manager_id">
                <el-select
                    v-model="updateStudent.manager_id"
                    placeholder="请选择学管"
                    clearable>
                    <el-option
                        v-for="item in managerOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item label="照片" prop="pictures">
                <el-upload
                    :action="baseApi + '/manage/img/upload'"
                    list-type="picture-card"
                    name="image"
                    accept="iamge/*"
                    :file-list="fileList"
                    :on-change="handleChange"
                    :auto-upload="true">
                    <el-icon><Plus /></el-icon>

                    <template #file="{ file }">
                        <div>
                            <img
                                class="el-upload-list__item-thumbnail"
                                :src="file.url"
                                alt="" />
                            <span class="el-upload-list__item-actions">
                                <span
                                    class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)">
                                    <el-icon><zoom-in /></el-icon>
                                </span>

                                <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click="handleRemove(file)">
                                    <el-icon><Delete /></el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="备注信息" prop="note" style="width: 100%">
                <Editor
                    v-model="updateStudent.note"
                    :api-key="tiny.apiKey"
                    :init="tiny.init" />
            </el-form-item>

            <el-form-item>
                <el-button
                    type="primary"
                    @click="
                        updateStudent._id == null
                            ? addData(studentFormRef)
                            : updateData(studentFormRef)
                    ">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
    // 引入路径标识，用于图片上传时解决跨域
    const baseApi = import.meta.env.VITE_APP_BASE_API;
    import { onMounted, reactive, ref } from "vue";
    import type { FormInstance, FormRules } from "element-plus";
    import Editor from "@tinymce/tinymce-vue";
    
    /* -----------关于图片上传-------------------- */
    import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";

    import type { UploadFile, UploadProps, UploadUserFile } from "element-plus";
    import { useRouter,useRoute } from "vue-router";
    let $router = useRouter()
    let $route = useRoute()
    // 引入自己封装的axios对象，用于发送图片删除请求
    import request from "@/utils/request";
    // 大图url
    const dialogImageUrl = ref("");
    // 大图是否展示
    const dialogVisible = ref(false);
    // 查看大图和删除按钮是否展示
    const disabled = ref(false);
    // 删除按钮回调
    const handleRemove = (file: UploadFile) => {
        request
            .post<any, any>("/manage/img/delete", { name: file.name })
            .then((response) => {
                if (response.status == 0) {
                    // 删除成功后，需要将此图片文件对象从已上传图片数组中删除
                    fileList.value.splice(fileList.value.indexOf(file), 1);
                }
            });
    };
    // 查看大图按钮回调
    const handlePictureCardPreview = (file: UploadFile) => {
        dialogImageUrl.value = file.url!;
        dialogVisible.value = true;
    };
    // 已上传图片数组
    const fileList = ref<UploadUserFile[]>([]);
    const handleChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
        if (uploadFile.status == "success") {
            // 从后端服务器返回的图片名称和url地址
            const result: any = uploadFile.response;
            if (result.status == 0) {
                // 解构出当前图片上传成功后在服务器内存储的名称和url地址
                const { name, url } = result.data;
                // 取出以上传图片数组中最后一项
                uploadFile = uploadFiles[uploadFiles.length - 1];
                // 将次文件的名称和url地址修改为服务器存储的
                uploadFile.name = name;
                uploadFile.url = url;
            }
        }
        fileList.value = uploadFiles;
    };
    // 为pictures字段赋值，就是将fileList数组中的数据转换为只保留name名称的数组，获取所有已上传图片名称
    const getImgs = () => {
        return fileList.value.map((item) => item.name);
    };

    import { studentInfoData } from "@/api/student/type";
    // 引入学生小仓库
    import useStudentStore from "@/store/modules/student";
    let studentStore = useStudentStore();

    // 引入班级小仓库
    import useClassStore from "@/store/modules/class";
    let classStore = useClassStore();
    // 引入角色小仓库
    import useRoleStore from "@/store/modules/role";
    let roleStore = useRoleStore();
    // 引入用户小仓库
    import useUserStore from "@/store/modules/user";
    import { userInfoData } from "@/api/user/type";
    import { roleInfoData } from "@/api/role/type";
    import { classInfoData } from "@/api/class/type";
    import { schoolInfoData } from "@/api/school/type";
    import { majorInfoData } from "@/api/major/type";
    let userStore = useUserStore();
    // 引入学校小仓库
    import useSchoolStore from "@/store/modules/school";
    let schoolStore = useSchoolStore();
    // 引入专业小仓库
    import useMajorStore from "@/store/modules/major";
    let majorStore = useMajorStore();
    // 所有用户数组
    let userOptions = ref<userInfoData[]>([]);
    // 所有角色数组
    let roleOptions = ref<roleInfoData[]>([]);
    // 角色为教师的_id
    let teacher_role_id = ref<string | undefined>("");
    // 角色为学管的_id
    let manager_role_id = ref<string | undefined>("");
    // 教师数组
    let teacherOptions = ref<userInfoData[]>([]);
    // 学管数组
    let managerOptions = ref<userInfoData[]>([]);

    // 性别/年级/学历/学习方法数据类型
    interface FilterData {
        _id: string;
        name: string;
    }
    // 性别数据列表
    let genderOptions = ref<FilterData[]>([
        { _id: "0", name: "男" },
        { _id: "1", name: "女" },
    ]);
    // 年级数据列表
    let gradeOptions = ref<FilterData[]>([
        { _id: "1", name: "大一" },
        { _id: "2", name: "大二" },
        { _id: "3", name: "大三" },
        { _id: "4", name: "大四" },
        { _id: "5", name: "在读研究生" },
    ]);
    // 学历数据列表
    let educationOptions = ref<FilterData[]>([
        { _id: "1", name: "专科" },
        { _id: "2", name: "本科" },
        { _id: "3", name: "硕士" },
        { _id: "4", name: "社会" },
    ]);
    // 学习方向数据列表
    let directionOptions = ref<FilterData[]>([
        { _id: "1", name: "web前端" },
        { _id: "2", name: "Java" },
        { _id: "3", name: "C/C++" },
        { _id: "4", name: "少儿编程" },
        { _id: "5", name: "直播电商" },
    ]);
    const classOptions = ref<classInfoData[]>([]);
    const schoolOptions = ref<schoolInfoData[]>([]);
    const majorOptions = ref<majorInfoData[]>([]);
    const getClassList = () => {
        if (classStore.classes?.length) {
            classOptions.value = classStore.classes;
        } else {
            classStore.getClassAll().then(() => {
                classOptions.value = classStore.classes as classInfoData[];
            });
        }
    };
    const getSchoolList = () => {
        if (schoolStore.schools?.length) {
            schoolOptions.value = schoolStore.schools;
        } else {
            schoolStore.getSchoolAll().then(() => {
                schoolOptions.value = schoolStore.schools as schoolInfoData[];
            });
        }
    };
    const getMajorList = () => {
        if (majorStore.majors?.length) {
            majorOptions.value = majorStore.majors;
        } else {
            majorStore.getMajorAll().then(() => {
                majorOptions.value = majorStore.majors as majorInfoData[];
            });
        }
    };

    // 获取所有的角色
    const getRoleList = () => {
        // 仓库中有数据，就不用再发送ajax请求了
        if (roleStore.roles?.length) {
            roleOptions.value = roleStore.roles;
            setRoleId();
        } else {
            roleStore.roleList().then(() => {
                roleOptions.value = roleStore.roles as roleInfoData[];
                setRoleId();
            });
        }
    };

    // 为教师/学管id赋值
    const setRoleId = () => {
        roleOptions.value.forEach((item) => {
            if (item.name == "教师") {
                teacher_role_id.value = item._id;
            } else if (item.name == "学管") {
                manager_role_id.value = item._id;
            }
        });
    };
    // 获取所有用户
    const getUserList = () => {
        if (userStore.users.length) {
            userOptions.value = userStore.users;
            setTeacherOrManagerOptions();
        } else {
            userStore.getUserAll().then(() => {
                userOptions.value = userStore.users;
                setTeacherOrManagerOptions();
            });
        }
    };
    // 为教师/学管数组赋值
    const setTeacherOrManagerOptions = () => {
        userOptions.value.forEach((item) => {
            if (item.role_id == teacher_role_id.value) {
                teacherOptions.value.push(item);
            } else if (item.role_id == manager_role_id.value) {
                managerOptions.value.push(item);
            }
        });
    };

    const updateStudent = ref({
        _id: null,
        name: "", //姓名
        gender: "", //性别
        school: "", //学校
        major: "", //专业
        grade: "", //年级
        education: "", //学历
        direction: "", //学习方向
        id_number: "", //身份号码
        phone: "", //电话号码
        parent: "", //家长姓名
        parent_phone: "", //家长联系电话
        address: "", //家庭住址
        qq: "", //QQ号码
        class: "", //所在班级
        admission_date: "", //入学时间
        teacher_id: "", //教师id
        manager_id: "", //学管id
        pictures: new Array<string>(), //照片数组
        note: "", //备注信息
    });
    const studentFormRef = ref<FormInstance>();
    // 自定义校验规则（电话号码的校验规则）
    const validatePhone = (_rule: any, value: any, callback: any) => {
        value = value.trim();
        const reg =
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (value == "") {
            callback(new Error("请输入手机号码"));
        } else if (!reg.test(value)) {
            callback(new Error("请输入正确的手机号码"));
        } else {
            callback();
        }
    };
    // 自定义校验规则（身份证号码的校验规则）
    const validateIdNumber = (_rule: any, value: any, callback: any) => {
        value = value.trim();
        const _IDRe18 =
            /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        const _IDre15 =
            /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;

        if (_IDRe18.test(value) || _IDre15.test(value)) {
            callback();
        } else {
            callback(new Error("请输入正确的身份证号码"));
        }
    };
    const rules = reactive<FormRules>({
        name:[{required:true,message:'请输入姓名',trigger:'blur'}],
        gender:[{required:true,message:'请选择性别',trigger:'change'}],
        direction:[{required:true,message:'请选择学习方向',trigger:'change'}],
        id_number:[{required:true,validator:validateIdNumber,trigger:['blur','change']}],
        phone:[{required:true,validator:validatePhone,trigger:['blur','change']}],
        class:[{required:true,message:'请选择班级',trigger:'change'}],
        admission_date:[{required:true,message:'请选择入学时间',trigger:'change'}],
        teacher_id:[{required:true,message:'请选择授课教师',trigger:'change'}],
        manager_id:[{required:true,message:'请选择学管',trigger:'change'}],
        
    });
    
    const addData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                // 先将照片数组进行赋值
                updateStudent.value.pictures = getImgs()
                studentStore.addStudent(updateStudent.value).then(()=>{
                    $router.push("/student")
                })
            } else {
                console.log("error submit!");
            }
        });
    };
    const updateData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                // 先将照片数组进行赋值
                updateStudent.value.pictures = getImgs()
                studentStore.updateStudent(updateStudent.value).then(()=>{
                    $router.push("/student")
                })
            } else {
                console.log("error submit!");
            }
        });
    };
    // 返回学校输入建议数据
    const querySearchSchool = (queryString: string, cb: any) => {
        // 由于element-plus中带有输入建议输入框中需要的数据必须包含value属性，但是学校列表中是schoolname，所以需要在数组中的每个对象中添加value属性
        schoolOptions.value.forEach((item) => {
            return (item.value = item.schoolname);
        });
        const results = queryString
            ? schoolOptions.value.filter(createFilter(queryString))
            : schoolOptions.value;
        // call callback function to return suggestions
        cb(results);
    };
    // 返回专业输入建议数据
    const querySearchMajor = (queryString: string, cb: any) => {
        // 由于element-plus中带有输入建议输入框中需要的数据必须包含value属性，但是学校列表中是schoolname，所以需要在数组中的每个对象中添加value属性
        majorOptions.value.forEach((item) => {
            return (item.value = item.majorname);
        });
        const results = queryString
            ? majorOptions.value.filter(createFilter(queryString))
            : majorOptions.value;
        // call callback function to return suggestions
        cb(results);
    };
    const createFilter = (queryString: string) => {
        return (restaurant: any) => {
            return (
                restaurant.value
                    .toLowerCase()
                    .indexOf(queryString.toLowerCase()) === 0
            );
        };
    };
    // 富文本编辑器内容
    const tiny = reactive({
        apiKey: "w8593t1vo6t8c9rf9zdr5m40p28g9j790kfdk0lema1vq658",
        init: {
            toolbar_mode: "sliding",
            plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss",
            toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
            ],
            ai_request: (_request: any, respondWith: any) =>
                respondWith.string(() =>
                    Promise.reject("See docs to implement AI Assistant")
                ),
        },
    });

    // 获取要编辑的学员原始数据
    const getStudent = ()=>{
        // 从路由对象中获取_id
        const {_id} = $route.params
        studentStore.getStudentById(_id as string).then(response=>{
            // @ts-ignore
            updateStudent.value =response
            // 将图片数组取出
            const {pictures} = response as studentInfoData
            if(pictures && pictures.length){
                fileList.value = pictures.map(item=>({
                    name:item,
                    url:baseApi + "/upload/" + item
                }))
            }
        })
        
    }

    onMounted(() => {
        getRoleList();
        getUserList();
        getClassList();
        getSchoolList();
        getMajorList();
        getStudent()
    });
</script>

<style scoped>
    .el-form-item {
        width: 50%;
    }
</style>
