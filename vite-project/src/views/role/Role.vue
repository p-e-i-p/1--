<template>
    <div>
        <div style="margin: 20px 0">
            <el-button type="primary" @click="handleAdd">添加角色</el-button>
            <el-button
                type="primary"
                :disabled="currentRow == null ? true : false"
                @click="roleAuthVisible = true"
                >设置角色权限</el-button>
        </div>
        <el-table
            ref="singleTableRef"
            height="380"
            border
            :data="roleList"
            highlight-current-row
            style="width: 100%"
            @current-change="handleCurrentChange">
            <el-table-column type="index" width="80" label="序号" />
            <el-table-column property="name" label="角色名称" />
            <el-table-column
                property="create_time"
                label="创建时间"
                :formatter="resetDate" />
            <el-table-column
                property="auth_time"
                label="授权时间"
                :formatter="resetDate" />
            <el-table-column property="auth_name" label="授权人" />
        </el-table>
        <!-- 添加角色弹窗 -->
        <el-dialog v-model="roleFormVisible" title="添加角色" width="500">
            <el-form
                :model="role"
                ref="roleFormRef"
                label-width="100px"
                style="width: 400px"
                :rules="rules">
                <el-form-item label="角色名称" prop="name">
                    <el-input
                        v-model="role.name"
                        placeholder="请输入角色名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="addData(roleFormRef)">
                        确定
                    </el-button>
                    <el-button @click="roleFormVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 设置角色权限弹窗 -->
        <el-dialog
            v-model="roleAuthVisible"
            title="设置角色权限"
            width="500">
           
            <template #footer>
                <div class="dialog-footer">
                    <Auth :role="currentRow" v-if="roleAuthVisible" ref="authRef"/>
                    <el-button
                        type="primary"
                        @click="updateData">
                        确定
                    </el-button>
                    <el-button @click="roleAuthVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
    import { onMounted, ref, reactive, nextTick } from "vue";
    import { ElTable } from "element-plus";
    // 引入角色小仓库
    import useRoleStore from "@/store/modules/role";
    import { roleInfoData } from "@/api/role/type";
    import { formateDate } from "@/utils/dateUtils";
    import Auth from './components/Auth.vue'
    import type { FormInstance, FormRules } from "element-plus";
    // 引入用户小仓库
    import useUserStore from "@/store/modules/user";
    let userStore = useUserStore()
    // 表单ref对象
    const roleFormRef = ref<FormInstance>();
    // 角色小仓库
    let roleStore = useRoleStore();
    // 当前选中的行
    const currentRow = ref();
    const singleTableRef = ref<InstanceType<typeof ElTable>>();
    // 角色列表数据
    let roleList = ref<roleInfoData[] | undefined>([]);
    // 当点击表格中某一行时触发的事件回调
    const handleCurrentChange = (val: any) => {
        currentRow.value = val;
    };
    // 打开添加角色弹窗
    const handleAdd = () => {
        roleFormVisible.value = true;
        nextTick(() => {
            // 重置表单，方式关闭弹窗以后再打开上一次输入的内容还在
            roleFormRef.value?.resetFields();
        });
    };
    // 获取角色列表
    const getRoleList = () => {
        // 调用角色小仓库中获取角色列表的方法
        roleStore.roleList().then(() => {
            // 如果获取成功就将小仓库中存储的角色列表赋值给roleList，在上面表格中进行展示
            roleList.value = roleStore.roles;
        });
    };
    // 格式化创建时间和授权时间数据
    const resetDate = (
        _row: any,
        _column: any,
        cellValue: any,
        _index: number
    ) => {
        // console.log(row,column,cellValue,index);
        return formateDate(cellValue);
    };

    // 添加角色弹窗是否展示
    const roleFormVisible = ref(false);
    // 设置角色权限弹窗是否展示
    const roleAuthVisible = ref(false);

    const role = ref({
        name: "",
    });
    // 添加角色弹窗中表单数据校验对象
    const rules = reactive<FormRules>({
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    });
    // 添加角色 确定按钮回调
    const addData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                roleStore.useAddRole(role.value).then(() => {
                    // 关闭弹窗
                    roleFormVisible.value = false;
                    // 重新调用获取角色列表方法，刷新表格数据
                    getRoleList();
                });
            } else {
                console.log("error submit!");
            }
        });
    };

    // 子组件（Auth）ref对象
    const authRef = ref()
    // 设置角色权限 确定按钮回调
    const updateData = () => {
       const newRole = authRef.value.getMenus()
       currentRow.value.menus = newRole.menus 
       currentRow.value.name = newRole.name
    //    授权人
        currentRow.value.auth_name = userStore.user?.username
        // 调用仓库中的actions，发送ajax请求更新数据库中的数据
        roleStore.useUpdateRole(currentRow.value).then(()=>{
            // 关闭设置角色权限弹窗
            roleAuthVisible.value = false
            // 调用获取角色列表方法，刷新表格中数据
            getRoleList()
        })
    };

    onMounted(() => {
        getRoleList();
    });
</script>

<style scoped></style>
