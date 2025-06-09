<template>
    <div>
        <div style="margin: 20px 0">
            <el-button type="primary" @click="handlerAdd">添加用户</el-button>
        </div>
        <el-table :data="users" style="width: 100%; height: 380px">
            <el-table-column
                label="序号"
                type="index"
                width="60"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="电话号码" prop="phone"></el-table-column>
            <el-table-column
                label="创建时间"
                prop="create_time"
                :formatter="resetDate"></el-table-column>
            <el-table-column
                label="所属角色"
                prop="role_id"
                :formatter="resetRole"></el-table-column>

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
            :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        <!-- 添加/编辑用户弹窗 -->
        <el-dialog v-model="userFormVisible" title="添加/编辑用户" width="500">
            <el-form
                :model="user"
                ref="userFormRef"
                :rules="rules"
                label-width="100px"
                label-position="right"
                style="width: 400px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="user.password" type="password" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="user.name" />
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select
                        v-model="user.role_id"
                        placeholder="请选择所属角色">
                        <el-option
                            v-for="option in roleOptions"
                            :label="option.name"
                            :value="option._id"
                            :key="option._id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                    <el-input v-model="user.phone" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button
                        type="primary"
                        @click="
                            user._id == null
                                ? addData(userFormRef)
                                : updateData(userFormRef)
                        ">
                        确定
                    </el-button>
                    <el-button @click="userFormVisible = false">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
    import { userInfoData } from "@/api/user/type";
    import { formateDate } from "@/utils/dateUtils";
    import { nextTick, onMounted, reactive, ref } from "vue";
    import type { FormInstance, FormRules } from "element-plus";
    import { ElMessage, ElMessageBox } from "element-plus";
    // 引入角色小仓库
    import useRoleStore from "@/store/modules/role";
    import { roleInfoData } from "@/api/role/type";
    let roleStore = useRoleStore();
    // 角色列表
    let roleOptions = ref<roleInfoData[]>([]);
    // 引入用户小仓库
    import useUserStore from "@/store/modules/user";
    let userStore = useUserStore();
    // 编辑
    const handleEdit = (_id: string) => {
        handlerAdd();

        userStore.getUserById(_id).then((response) => {
            // @ts-ignore
            user.value = response;
        });
    };
    // 更新用户信息
    const updateData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                userStore.updateUser(user.value).then(() => {
                    userFormVisible.value = false;
                    userList();
                });
            } else {
                console.log("error submit!");
            }
        });
    };
    // 删除
    const handleDelete = (_id: string) => {
        ElMessageBox.confirm("确定要删除此条数据码?", "Warning", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                userStore.deleteUser(_id).then(() => {
                    ElMessage({
                        type: "success",
                        message: "删除成功！",
                    });
                    // 重新获取用户列表，刷新表格中数据
                    userList()
                });
            })
            .catch(() => {});
    };
    const users = ref<userInfoData[]>([]);
    // 格式化时间数据
    const resetDate = (
        _row: any,
        _column: any,
        cellvalue: any,
        _index: number
    ) => {
        return formateDate(cellvalue);
    };
    // 格式化角色数据
    const resetRole = (
        _row: any,
        _column: any,
        cellvalue: any,
        _index: number
    ) => {
        // 根据cellvalue（当前要展示用户数据的所属角色_id 到 角色列表中查询，如果找到了就存储到变量中）
        let role =
            roleOptions?.value?.find((item) => item._id == cellvalue) || {};
        // @ts-ignore     忽略ts对下句代码的检测
        return role.name;
    };
    // 获取角色列表
    const getRoleList = () => {
        // 如果仓库中有角色列表数据，那么就不用再发送ajax请求了
        if (roleStore.roles?.length) {
            roleOptions.value = roleStore.roles;
        } else {
            // 仓库中没有数据，就需要发送ajax请求向后端获取数据了
            roleStore.roleList().then(() => {
                roleOptions.value = roleStore.roles as roleInfoData[];
            });
        }
    };
    // 当前的页码
    const currentPage = ref(1);
    // 每页显示多少条数据
    const pageSize = ref(5);
    // 用户数据列表总条数
    const total = ref(0);
    // 当每页显示多少条数据发生变化时触发的函数
    const handleSizeChange = (val: number) => {
       pageSize.value = val
       userList()
    };
    // 当页码发生变化时触发的函数
    const handleCurrentChange = (val: number) => {
        currentPage.value = val
        userList()
    };
    // 获取用户列表
    const userList = () => {
        userStore
            .getUserList({ page: currentPage.value, size: pageSize.value })
            .then((response) => {
                users.value = userStore.users;
                total.value = response?.total as number;
            });
    };

    // 打开添加用户弹窗
    const handlerAdd = () => {
        userFormVisible.value = true;
        // 清空user对象（表单的数据来源）防止点击编辑按钮之后，_id就不再为null，就无法进行添加用户了
        user.value = {
            _id: null,
            username: "",
            name: "",
            password: "",
            role_id: "",
            phone: "",
        };
        nextTick(() => {
            userFormRef.value?.resetFields();
        });
    };
    // 收集添加角色数据对象
    let user = ref({
        _id: null,
        username: "",
        name: "",
        password: "",
        role_id: "",
        phone: "",
    });
    // 添加/编辑用户弹窗是否展示
    const userFormVisible = ref(false);
    // 表单ref对象
    const userFormRef = ref<FormInstance>();
    // 自定义校验规则（账号的校验规则）
    const validateUsername = (_rule: any, value: any, callback: any) => {
        value = value.trim();
        const length = value && value.length;
        const reg = /^[a-zA-Z0-9_]+$/;
        if (value == "") {
            callback(new Error("请输入账号"));
        } else if (length < 4 || length > 12) {
            callback(new Error("请输入4到12位直接的账号"));
        } else if (!reg.test(value)) {
            callback(new Error("账号只能包含英文字母数字和下划线"));
        } else {
            callback();
        }
    };
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
    // 校验规则
    const rules = reactive<FormRules>({
        username: [
            {
                required: true,
                validator: validateUsername,
                trigger: ["blur", "change"],
            },
        ],
        password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
                min: 4,
                message: "请输入4位以上长度的密码",
                trigger: ["blur", "change"],
            },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        role_id: [
            { required: true, message: "请选择所属角色", trigger: "change" },
        ],
        phone: [
            {
                required: true,
                validator: validatePhone,
                trigger: ["blur", "change"],
            },
        ],
    });
    const addData = (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        formEl.validate((valid) => {
            if (valid) {
                userStore.addUser(user.value).then(() => {
                    userFormVisible.value = false;
                    userList();
                });
            } else {
                console.log("error submit!");
            }
        });
    };
    onMounted(() => {
        getRoleList();
        userList();
    });
</script>

<style scoped></style>
