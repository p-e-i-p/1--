<template>
    <div>
        <!-- 条件查询表单 -->
        <el-form
            :inline="true"
            :model="searchMap"
            class="demo-form-inline"
            style="margin: 20px 0"
            ref="searchFormRef">
            <el-form-item style="width: 300px" prop="teacher_id">
                <el-select
                    v-model="searchMap.teacher_id"
                    placeholder="根据教师查询"
                    clearable>
                    <el-option
                        v-for="item in teacherOptions"
                        :label="item.name"
                        :value="item._id"
                        :key="item._id" />
                </el-select>
            </el-form-item>
            <el-form-item style="width: 300px" prop="manager_id">
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
                    >添加班级</el-button
                >
                <el-button @click="resetForm(searchFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-table :data="classes" style="width: 100%; height: 380px">
            <el-table-column
                label="序号"
                type="index"
                width="80"></el-table-column>
            <el-table-column
                label="班级名称"
                prop="classname"></el-table-column>
            <el-table-column
                label="授课教师"
                :formatter="formatTeacher"
                prop="teacher_id"></el-table-column>
            <el-table-column
                label="学管"
                prop="manager_id"
                :formatter="formatManager"></el-table-column>

            <el-table-column label="Operations">
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
            :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        <!-- 添加/编辑班级弹窗 -->
        <el-dialog v-model="classFormVisible" title="添加/编辑班级" width="500">
            <el-form
                :model="updateClass"
                ref="classFormRef"
                label-width="100px"
                label-position="right"
                style="width: 400px"
                :rules="rules">
                <el-form-item label="班级名称" prop="classname">
                    <el-input v-model="updateClass.classname" />
                </el-form-item>
                <el-form-item label="授课教师" prop="teacher_id">
                    <el-select
                        v-model="updateClass.teacher_id"
                        placeholder="请选择授课教师">
                        <el-option
                            v-for="item in teacherOptions"
                            :label="item.name"
                            :value="item._id"
                            :key="item._id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="学管" prop="manager_id">
                    <el-select
                        v-model="updateClass.manager_id"
                        placeholder="请选择学管">
                        <el-option
                            v-for="item in managerOptions"
                            :label="item.name"
                            :value="item._id"
                            :key="item._id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        type="primary"
                        @click="
                            updateClass._id == null
                                ? addData(classFormRef)
                                : updateData(classFormRef)
                        ">
                        确定
                    </el-button>
                    <el-button @click="classFormVisible = false"
                        >取消</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
    import { classInfoData } from "@/api/class/type";
    import { nextTick, onMounted, reactive, ref } from "vue";
    import type { FormInstance, FormRules } from "element-plus";
    import { ElMessage, ElMessageBox } from "element-plus";
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
    // 格式化教师名称
    const formatTeacher = (
        _row: any,
        _colum: any,
        cellValue: string,
        _index: number
    ) => {
        let teacher = teacherOptions.value.find(
            (item) => item._id == cellValue
        );
        return teacher?.name;
    };
    // 格式化学管名称
    const formatManager = (
        _row: any,
        _colum: any,
        cellValue: string,
        _index: number
    ) => {
        let manager = managerOptions.value.find(
            (item) => item._id == cellValue
        );
        return manager?.name;
    };

    const classes = ref<classInfoData[]>([]);
    const handleEdit = (_id: string) => {
        handlerAdd();
        classStore.getClassById(_id).then((response) => {
            // @ts-ignore
            updateClass.value = response;
        });
    };
    const handleDelete = (_id: string) => {
        ElMessageBox.confirm("确定要删除此条数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                classStore.deleteClass(_id).then(() => {
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                    getClassList()
                });
            })
            .catch(() => {});
    };
    // 获取班级列表
    const getClassList = () => {
        classStore
            .getClassList({
                page: currentPage.value,
                size: pageSize.value,
                searchMap: searchMap.value,
            })
            .then((response) => {
                // @ts-ignore
                classes.value = classStore.classes;
                total.value = response?.total as number;
            });
    };
    const currentPage = ref(1);
    const pageSize = ref(5);
    const total = ref(0);
    // 查询条件对象
    const searchMap = ref({
        teacher_id: "",
        manager_id: "",
    });
    const handleSizeChange = (val: number) => {
        pageSize.value = val;
        getClassList();
    };
    const handleCurrentChange = (val: number) => {
        currentPage.value = val;
        getClassList();
    };
    // 条件查询
    const searchData = () => {
        currentPage.value = 1;
        getClassList();
    };
    // 打开添加班级弹窗
    const handlerAdd = () => {
        classFormVisible.value = true;
        updateClass.value = {
            _id: null,
            classname: "",
            teacher_id: "",
            manager_id: "",
        };
        nextTick(() => {
            classFormRef.value?.resetFields();
        });
    };
    // 条件查询表单ref对象
    const searchFormRef = ref<FormInstance>();
    // 重置条件查询表单数据
    const resetForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.resetFields();
    };
    // 添加/编辑班级弹窗是否展示
    const classFormVisible = ref(false);
    // 收集添加班级表单数据对象
    const updateClass = ref({
        _id: null,
        classname: "",
        teacher_id: "",
        manager_id: "",
    });
    // 添加/编辑班级表单ref对象
    const classFormRef = ref<FormInstance>();
    const rules = reactive<FormRules>({
        classname: [
            { required: true, message: "请输入班级名称", trigger: "blur" },
        ],
        teacher_id: [
            { required: true, message: "请选择授课教师", trigger: "change" },
        ],
        manager_id: [
            { required: true, message: "请选择学管", trigger: "change" },
        ],
    });
    const addData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                classStore.addClass(updateClass.value).then(() => {
                    classFormVisible.value = false;
                    getClassList();
                });
            } else {
            }
        });
    };
    const updateData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                classStore.updateClass(updateClass.value).then(() => {
                    classFormVisible.value = false;
                    getClassList();
                });
            } else {
                console.log("error submit!");
            }
        });
    };

    onMounted(() => {
        getRoleList();
        getUserList();
        getClassList();
    });
</script>

<style scoped></style>
