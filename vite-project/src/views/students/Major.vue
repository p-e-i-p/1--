<template>
    <div>
        <div style="margin: 20px 0">
            <el-button type="primary" @click="handlerAdd">添加专业</el-button>
        </div>
        <el-table :data="majors" style="width: 100%; height: 380px">
            <el-table-column
                label="序号"
                type="index"
                width="80"></el-table-column>
            <el-table-column
                label="专业名称"
                prop="majorname"></el-table-column>

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

        <!-- 添加专业弹窗 -->
        <el-dialog
            v-model="majorFormVisible"
            title="添加/编辑专业"
            width="500">
            <el-form
                :model="major"
                label-width="100px"
                style="width: 400px"
                ref="majorFormRef"
                :rules="rules">
                <el-form-item label="专业名称" prop="majorname">
                    <el-input
                        v-model="major.majorname"
                        placeholder="请输入专业名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        type="primary"
                        @click="
                            major._id == null
                                ? addData(majorFormRef)
                                : updateData(majorFormRef)
                        ">
                        确定
                    </el-button>
                    <el-button @click="majorFormVisible = false"
                        >取消</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
    import { majorInfoData } from "@/api/major/type";
    import { nextTick, onMounted, reactive, ref } from "vue";
    import type { FormInstance, FormRules } from "element-plus";
    import { ElMessage, ElMessageBox } from "element-plus";
    // 引入专业小仓库
    import useMajorStore from "@/store/modules/major";
    let majorStore = useMajorStore();
    let majors = ref<majorInfoData[]>([]);
    // 获取专业列表
    const getMajorList = () => {
        majorStore
            .getMajorList({ page: currentPage.value, size: pageSize.value })
            .then((response) => {
                majors.value = majorStore.majors as majorInfoData[];
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
        getMajorList();
    };
    // 当页码发生变化时触发的函数
    const handleCurrentChange = (val: number) => {
        currentPage.value = val;
        getMajorList();
    };
    // 编辑
    const handleEdit = (_id: string) => {
        handlerAdd();
        majorStore.getMajorById(_id).then((response) => {
            // @ts-ignore
            major.value = response;
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
                majorStore.deleteMajor(_id).then(() => {
                    ElMessage({
                        type: "success",
                        message: "删除成功",
                    });
                    getMajorList();
                });
            })
            .catch(() => {});
    };

    // 打开添加专业弹窗
    const handlerAdd = () => {
        majorFormVisible.value = true;
        major.value = {
            _id: null,
            majorname: "",
        };
        nextTick(() => {
            majorFormRef.value?.resetFields();
        });
    };
    // 添加专业弹窗是否展示
    const majorFormVisible = ref(false);
    const majorFormRef = ref<FormInstance>();
    const rules = reactive<FormRules>({
        majorname: [
            { required: true, message: "请输入专业名称", trigger: "blur" },
        ],
    });
    // 接收添加/编辑专业表单数据
    const major = ref({
        _id: null,
        majorname: "",
    });
    const addData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                majorStore.addMajor(major.value).then(() => {
                    majorFormVisible.value = false;
                    getMajorList();
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
                majorStore.updateMajor(major.value).then(() => {
                    majorFormVisible.value = false;
                    getMajorList();
                });
            } else {
                console.log("error submit!");
            }
        });
    };
    onMounted(() => {
        getMajorList();
    });
</script>

<style scoped></style>
