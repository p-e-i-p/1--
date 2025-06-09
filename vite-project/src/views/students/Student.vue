<template>
    <div>
        <el-form
            :inline="true"
            :model="searchMap"
            style="margin: 20px 0"
            ref="searchFormRef">
            <el-form-item prop="name">
                <el-input
                    v-model="searchMap.name"
                    placeholder="根据姓名查询"
                    clearable />
            </el-form-item>
            <el-form-item prop="direction" style="width: 200px">
                <el-select
                    v-model="searchMap.direction"
                    placeholder="根据学习方向查询"
                    clearable>
                    <el-option
                        v-for="item in directionOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item prop="class" style="width: 200px">
                <el-select
                    v-model="searchMap.class"
                    placeholder="根据班级查询"
                    clearable>
                    <el-option
                        v-for="item in classOptions"
                        :label="item.classname"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item prop="teacher_id" style="width: 200px">
                <el-select
                    v-model="searchMap.teacher_id"
                    placeholder="根据授课教师查询"
                    clearable>
                    <el-option
                        v-for="item in teacherOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item prop="manager_id" style="width: 200px">
                <el-select
                    v-model="searchMap.manager_id"
                    placeholder="根据学管查询"
                    clearable>
                    <el-option
                        v-for="item in managerOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchData">查询</el-button>
                <el-button type="primary" @click="handlerAdd"
                    >添加学员</el-button
                >
                <el-button @click="resetForm(searchFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-table :data="students" style="width: 100%; height: 450px">
            <el-table-column type="expand">
                <template #default="props">
                    <div style="padding: 20px">
                        <p>学生姓名: {{ props.row.name }}</p>
                        <p>
                            性别:
                            {{ dataFilter(props.row.gender, genderOptions) }}
                        </p>
                        <p>所在学校: {{ props.row.school }}</p>
                        <p>专业: {{ props.row.major }}</p>
                        <p>
                            年级:
                            {{ dataFilter(props.row.grade, gradeOptions) }}
                        </p>
                        <p>
                            学历:
                            {{
                                dataFilter(
                                    props.row.education,
                                    educationOptions
                                )
                            }}
                        </p>
                        <p>
                            学习方向:
                            {{
                                dataFilter(
                                    props.row.direction,
                                    directionOptions
                                )
                            }}
                        </p>
                        <p>身份号码: {{ props.row.id_number }}</p>
                        <p>电话号码: {{ props.row.phone }}</p>
                        <p>家长姓名: {{ props.row.parent }}</p>
                        <p>家长联系电话: {{ props.row.parent_phone }}</p>
                        <p>家庭住址: {{ props.row.address }}</p>
                        <p>QQ号码: {{ props.row.qq }}</p>
                        <p>
                            所在班级:
                            {{ classFilter(props.row.class, classOptions) }}
                        </p>
                        <p>入学时间: {{ props.row.admission_date }}</p>
                        <p>
                            授课教师:
                            {{
                                dataFilter(props.row.teacher_id, teacherOptions)
                            }}
                        </p>
                        <p>
                            学管:
                            {{
                                dataFilter(props.row.manager_id, managerOptions)
                            }}
                        </p>
                        <p>
                            照片:
                            <el-image
                                v-for="(item, index) in props.row.pictures"
                                style="
                                    width: 200px;
                                    height: 200px;
                                    margin-right: 5px;
                                "
                                :src="baseApi + '/upload/' + item"
                                :key="index"
                                fit="cover" />
                        </p>
                        <p>备注信息: <span v-html="props.row.note"></span></p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="序号" type="index" width="80px" />
            <el-table-column label="学生姓名" prop="name" width="100px" />
            <el-table-column label="性别" prop="gender" width="100px">
                <template #default="scope">
                    {{ dataFilter(scope.row.gender, genderOptions) }}
                </template>
            </el-table-column>
            <el-table-column label="学习方向" prop="direction">
                <template #default="scope">
                    {{ dataFilter(scope.row.direction, directionOptions) }}
                </template>
            </el-table-column>
            <el-table-column label="电话号码" prop="phone" />
            <el-table-column label="所在班级" prop="class">
                <template #default="scope">
                    {{ classFilter(scope.row.class, classOptions) }}
                </template>
            </el-table-column>

            <el-table-column label="授课教师" prop="teacher_id">
                <template #default="scope">
                    {{ dataFilter(scope.row.teacher_id, teacherOptions) }}
                </template>
            </el-table-column>

            <el-table-column label="学管" prop="manager_id">
                <template #default="scope">
                    {{ dataFilter(scope.row.manager_id, managerOptions) }}
                </template>
            </el-table-column>
            <el-table-column label="入学时间" prop="admission_date" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row._id)">
                        编辑
                    </el-button>
                    <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.row._id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
<script setup lang="ts">
    // 引入路径标识，用于图片上传时解决跨域
    const baseApi = import.meta.env.VITE_APP_BASE_API;
    import { ElMessage, ElMessageBox } from "element-plus";
    import { onMounted, ref } from "vue";
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
    import { FormInstance } from "element-plus";
    let userStore = useUserStore();

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

    const getClassList = () => {
        if (classStore.classes?.length) {
            classOptions.value = classStore.classes;
        } else {
            classStore.getClassAll().then(() => {
                classOptions.value = classStore.classes as classInfoData[];
            });
        }
    };
    // 过滤数据
    const dataFilter = (_id: string, options: any) => {
        let obj = options?.find((item: any) => item._id == _id);
        return obj ? obj.name : "";
    };
    // 过滤班级数据
    const classFilter = (_id: string, options: any) => {
        let obj = options?.find((item: any) => item._id == _id);
        return obj ? obj.classname : "";
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

    // 学生列表数组
    const students = ref<studentInfoData[]>([]);
    // 条件查询对象
    const searchMap = ref({
        name: "",
        direction: "",
        class: "",
        teacher_id: "",
        manager_id: "",
    });
    // 学生数据总条数
    const total = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const handleSizeChange = (val: number) => {
        pageSize.value = val;
        getStudentList();
    };
    const handleCurrentChange = (val: number) => {
        currentPage.value = val;
        getStudentList();
    };
    // 获取学生列表
    const getStudentList = () => {
        studentStore
            .getStudentList({
                page: currentPage.value,
                size: pageSize.value,
                searchMap: searchMap.value,
            })
            .then((response) => {
                students.value = studentStore.students as studentInfoData[];
                total.value = response?.total as number;
            });
    };
    // 添加查询表单ref对象
    const searchFormRef = ref<FormInstance>();
    // 查询
    const searchData = () => {
        currentPage.value = 1;
        getStudentList();
    };

    // 引入路由器对象
    import { useRouter } from "vue-router";
    const $router = useRouter();
    // 跳转到添加组件
    const handlerAdd = () => {
        $router.push(`/student/update/-1`);
    };
    // 重置条件查询表单数据
    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.resetFields();
    };
    // 编辑
    const handleEdit = (_id: string) => {
        $router.push(`/student/update/${_id}`);
    };
    // 删除
    const handleDelete = (_id: string) => {
        ElMessageBox.confirm("确定要删除此条数据吗?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                studentStore.deleteStudent(_id).then(() => {
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                    getStudentList()
                });
            })
            .catch(() => {});
    };
    onMounted(() => {
        getRoleList();
        getUserList();
        getClassList();
        getStudentList();
    });
</script>

<style scoped></style>
