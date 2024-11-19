<template>
  <div>
    <div style="margin: 20px 0">
      <el-button type="primary" @click="handleAdd">创建角色</el-button>
      <el-button
        type="primary"
        :disabled="isDisabled"
        @click="roleAuthVisible = true"
      >
        设置角色权限
      </el-button>
    </div>
    <el-table
      ref="singleTableRef"
      :data="roleList"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
      class="role_table"
      height="380"
    >
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column property="name" label="角色名称" />
      <el-table-column
        property="create_time"
        label="创建时间"
        :formatter="resetDate"
      />
      <el-table-column
        property="auth_time"
        label="授权时间"
        :formatter="resetDate"
      />
      <el-table-column property="auth_name" label="授权人" />
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog v-model="roleFormVisible" title="添加角色" width="500px">
      <el-form
        :model="role"
        ref="roleFormRef"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入角色名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="addData(roleFormRef)">
            确定
          </el-button>
          <el-button @click="roleFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 设置角色权限对话框 -->
    <el-dialog v-model="roleAuthVisible" title="设置角色权限" width="500px">
      <Auth ref="authRef" :role="currentRow" v-if="roleAuthVisible" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updateData">确定</el-button>
          <el-button @click="roleAuthVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
// 引入角色数据类型
import type { roleInfoData } from '@/api/role/types'
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
// 引入格式化日期方法
import { formateDate } from '@/utils/dateUtils'
// 引入权限组件
import Auth from './components/Auth.vue'
// 格式化日期
// @ts-ignore
const resetDate = (row: any, colum: any, cellValue: number, index: number) => {
  return formateDate(cellValue)
}
let useStore = useRoleStore()
let userStore = useUserStore()
// 当前选中的行
let currentRow = reactive<roleInfoData>(null)
// 控制设置角色权限按钮是否为禁用状态
let isDisabled = ref(true)
// 数据列表
let roleList = ref<roleInfoData[]>([])
// 添加角色弹窗中表单ref对象
const roleFormRef = ref<FormInstance>()
// 添加角色数据收集对象
let role = reactive({
  name: '',
})
// 表单校验规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
})
// 添加角色弹窗是否展示
const roleFormVisible = ref(false)
// 设置角色权限对话框是否展示
const roleAuthVisible = ref(false)
// 选中行回调事件
const handleCurrentChange = (val: any) => {
  currentRow = val
  isDisabled.value = false
}
// 添加角色弹窗显示
const handleAdd = () => {
  // 弹窗展示
  roleFormVisible.value = true
  nextTick(() => {
    // 表单重置
    roleFormRef.value.resetFields()
  })
}
// 添加角色
const addData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      useStore.useAddRole(role).then(() => {
        // 关闭添加角色对话框
        roleFormVisible.value = false
        // 重新获取角色列表数据，刷新页面
        getRoleList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
// Auth组件对象
const authRef = ref()
// 设置角色权限
const updateData = () => {
  const newRole = authRef.value.getMenus()
  currentRow.menus = newRole.menus
  currentRow.name = newRole.name
  currentRow.auth_name = userStore.user?.username

  useStore.useUpdateRole(currentRow).then(() => {
    roleAuthVisible.value = false
    getRoleList()
  })
}
// 获取角色列表
const getRoleList = () => {
  useStore.roleList().then(() => {
    roleList.value = useStore.roles
  })
}

onMounted(() => {
  getRoleList()
})
</script>

<style scoped></style>
