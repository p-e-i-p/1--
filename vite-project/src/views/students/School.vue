<template>
    <div>
        <div style="margin: 20px 0">
            <el-button type="primary" @click="handlerAdd">添加学校</el-button>
        </div>
        <el-table :data="schools" style="width: 100%; height: 380px">
            <el-table-column
                label="序号"
                type="index"
                width="80"></el-table-column>
            <el-table-column
                label="学校名称"
                prop="schoolname"></el-table-column>

            <el-table-column label="操作" width="200">
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

        <!-- 添加学校弹窗 -->
        <el-dialog
            v-model="schoolFormVisible"
            title="添加/编辑学校"
            width="500">
            <el-form
                :model="school"
                label-width="100px"
                style="width: 400px"
                ref="schoolFormRef"
                :rules="rules">
                <el-form-item label="学校名称" prop="schoolname">
                    <el-input
                        v-model="school.schoolname"
                        placeholder="请输入学校名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        type="primary"
                        @click="
                            school._id == null
                                ? addData(schoolFormRef)
                                : updateData(schoolFormRef)
                        ">
                        确定
                    </el-button>
                    <el-button @click="schoolFormVisible = false"
                        >取消</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
    import { schoolInfoData } from "@/api/school/type";
    import { nextTick, onMounted, reactive, ref } from "vue";
    import type { FormInstance, FormRules } from "element-plus";
    import { ElMessage, ElMessageBox } from "element-plus";
    // 引入学校小仓库
    import useSchoolStore from "@/store/modules/school";
    let schoolStore = useSchoolStore();
    let schools = ref<schoolInfoData[]>([]);
    // 获取学校列表
    const getSchoolList = () => {
        schoolStore
            .getSchoolList({ page: currentPage.value, size: pageSize.value })
            .then((response) => {
                schools.value = schoolStore.schools as schoolInfoData[];
                total.value = response?.total as number;
            });
    };
    // 当前页码
    const currentPage = ref(1);
    // 每页显示多少条数据
    const pageSize = ref(5);
    // 数据总条数
    const total = ref(0);
    // 当每页显示多少条数据发生变化时触发的函数
    const handleSizeChange = (val: number) => {
        pageSize.value = val;
        getSchoolList();
    };
    // 当页码发生变化时触发的函数
    const handleCurrentChange = (val: number) => {
        currentPage.value = val;
        getSchoolList();
    };
    // 编辑
    const handleEdit = (_id: string) => {
        handlerAdd();
        schoolStore.getSchoolById(_id).then((response) => {
            // @ts-ignore
            school.value = response;
        });
    };
    // 删除
    const handleDelete = (_id: string) => {
        ElMessageBox.confirm("确定要删除此条数据吗?", "Warning", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                schoolStore.deleteSchool(_id).then(() => {
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                    getSchoolList();
                });
            })
            .catch(() => {});
    };

    // 打开添加学校弹窗
    const handlerAdd = () => {
        schoolFormVisible.value = true;
        school.value = {
            _id: null,
            schoolname: "",
        };
        nextTick(() => {
            schoolFormRef.value?.resetFields();
        });
    };
    // 添加学校弹窗是否展示
    const schoolFormVisible = ref(false);
    const schoolFormRef = ref<FormInstance>();
    const rules = reactive<FormRules>({
        schoolname: [
            { required: true, message: "请输入学校名称", trigger: "blur" },
        ],
    });
    // 接收添加/编辑学校表单数据
    const school = ref({
        _id: null,
        schoolname: "",
    });
    const addData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                schoolStore.addSchool(school.value).then(() => {
                    schoolFormVisible.value = false;
                    getSchoolList();
                });
            } else {
                console.log("error submit!");
            }
        });
    };
    const updateData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                schoolStore.updateSchool(school.value).then(() => {
                    schoolFormVisible.value = false;
                    getSchoolList();
                });
            } else {
                console.log("error submit!");
            }
        });
    };
    onMounted(() => {
        getSchoolList();
    });
</script>

<style scoped></style>
