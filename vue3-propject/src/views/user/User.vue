<template>
  <div>
    <div style="margin: 20px 0">
      <el-button type="primary" @click="handleAdd">添加用户</el-button>
    </div>
    <el-table :data="users" style="width: 100%; height: 380px">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="电话号码" />
      <el-table-column
        prop="create_time"
        label="创建时间"
        :formatter="resetDate"
      />
      <el-table-column
        prop="role_id"
        label="所属角色"
        :formatter="formatRole"
      />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleEdit(scope.row._id)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleDelete(scope.row._id)"
          >
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
      @current-change="handleCurrentChange"
    />
    <!-- 添加/编辑用户对话框 -->
    <el-dialog v-model="userFormVisible" title="添加/编辑用户" width="500px">
      <el-form
        :model="user"
        ref="userFormRef"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" />
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="user.role_id" placeholder="请点击选择">
            <el-option
              v-for="option in roleOptions"
              :key="option._id"
              :label="option.name"
              :value="option._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="user.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="
              user._id == null ? addData(userFormRef) : updateData(userFormRef)
            "
          >
            确定
          </el-button>
          <el-button @click="userFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
// 引入格式化日期方法
import { formateDate } from '@/utils/dateUtils'
// 格式化日期
// @ts-ignore
const resetDate = (row: any, colum: any, cellValue: number, index: number) => {
  return formateDate(cellValue)
}
// 引入角色小仓库
import useRoleStore from '@/store/modules/role'
let roleStore = useRoleStore()
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
// 引入用户数据类型
import type { userInfoData } from '@/api/user/type'
let userStore = useUserStore()
import type { roleInfoData } from '@/api/role/types'

import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
// 自定义校验规则（用于用户名的校验）
const validateUserName = (rule: any, value: any, callback: any) => {
  rule = rule
  value = value.trim()
  const length = value && value.length
  const userNameReg = /^[a-zA-Z0-9_]+$/
  if (value === '') {
    callback(new Error('请输入账号'))
  } else if (length < 4 || length > 12) {
    callback(new Error('长度需在4 至 12位之间'))
  } else if (!userNameReg.test(value)) {
    callback(new Error('账号必须有英文字母、数字或下划线组成'))
  } else {
    callback()
  }
}
const validatePhone = (rule: any, value: any, callback: any) => {
  rule = rule
  value = value.trim()
  const phoneRef =
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (value === '') {
    callback(new Error('请输入电话号码'))
  } else if (!phoneRef.test(value)) {
    callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}
// 收集添加/编辑用户对象数据
const user = ref<userInfoData | undefined>({
  _id: null,
  username: '',
  password: '',
  name: '',
  phone: '',
  role_id: '',
})
// 添加/编辑用户对话框是否展示
const userFormVisible = ref(false)
// 表单元素对象
const userFormRef = ref<FormInstance>()
// 表单校验规则
const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      validator: validateUserName,
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, message: '密码长度需大于等于4位', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role_id: [{ required: true, message: '选择角色', trigger: 'blur' }],
  phone: [
    { required: true, validator: validatePhone, trigger: ['blur', 'change'] },
  ],
})

// 当前页码
const currentPage = ref(1)
// 每页显示多少条数据
const pageSize = ref(5)
// 总数据条数
const total = ref(0)
// 总页数
const totalPage = ref(1)
// 当前页码发生变化的回调
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUserList()
}
// 当每页显示数据条数发生变化回调
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getUserList()
}

// 添加角色按钮点击回调
const handleAdd = () => {
  // 每次弹窗显示之前先初始化一下user对象，防止编辑过后user对象内一直存储信息，_id不再为null，无法进行添加操作
  user.value = {
    _id: null,
    username: '',
    password: '',
    name: '',
    phone: '',
    role_id: '',
  }
  userFormVisible.value = true
  nextTick(() => {
    userFormRef.value.resetFields()
  })
}

// 添加用户
const addData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      userStore.addUser(user.value as userInfoData).then(() => {
        userFormVisible.value = false
        getUserList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 更新用户信息
const updateData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      userStore.updateUser(user.value as userInfoData).then(() => {
        userFormVisible.value = false
        getUserList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 角色列表
let roleOptions = ref<roleInfoData[] | undefined>([])
// 获取角色列表
const getRoleList = () => {
  if (roleStore.roles?.length) {
    roleOptions.value = roleStore.roles
  } else {
    roleStore.roleList().then(() => {
      roleOptions.value = roleStore.roles
    })
  }
}
// 获取用户列表
const getUserList = () => {
  userStore
    .getUserList({ page: currentPage.value, size: pageSize.value })
    .then((response) => {
      users.value = userStore.users
      total.value = response.total as number
      totalPage.value = total.value / pageSize.value
    })
}
onMounted(() => {
  getRoleList()
  getUserList()
})
const users = ref<userInfoData[] | undefined>([])
// 格式化角色名称
// @ts-ignore
const formatRole = (row: any, colum: any, cellValue: string, index: number) => {
  let role = roleOptions?.value?.find((item) => item._id == cellValue)
  return role?.name
}

// 编辑
const handleEdit = (_id) => {
  // 让添加/编辑弹窗展示
  handleAdd()
  userStore.getUserById(_id).then((response) => {
    user.value = response
  })
}
// 删除
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除此条数据吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      userStore.deleteUser(_id).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getUserList()
      })
    })
    .catch(() => {})
}
</script>

<style scoped></style>
