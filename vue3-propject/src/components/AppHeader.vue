<template>
  <div class="header">
    <div style="background-color:#4d4948 ; float:left;width: 230px;">
    <a href="#" >
     <b style="margin: 0 30px;color:#e96101 ;font-size: large;">A</b>
      <span class="title">学员管理系统</span>
    </a>
  </div>
    <!-- 下拉菜单 -->
    <el-dropdown @command="handleCommand" trigger="click" style="background-color: #e96101;padding: 0 10px;">
      <span class="el-dropdown-link">
        {{ userStore.user ? userStore.user.name : '请先登录' }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="date">{{ currentTime }}</span>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500px">
      <el-form
        :model="userForm"
        ref="userFormRef"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="原始密码" prop="oldPass">
          <el-input v-model="userForm.oldPass" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="userForm.pass" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="userForm.checkPass" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="updatePwd(userFormRef)">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { formateTime } from '@/utils/dateUtils'
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reqCheckPwd, reqUpdatePwd } from '@/api/user'
import { useRouter } from 'vue-router'
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
const $router = useRouter()

// 控制对话框是否展示
const dialogFormVisible = ref(false)
// 收集修改密码表单数据
const userForm = reactive({
  oldPass: '',
  pass: '',
  checkPass: '',
})

// 表单对象
const userFormRef = ref<FormInstance>()

// 自定义校验规则----两次密码是否一致
const validatePass = (rule: any, value: any, callback: any) => {
  rule = rule
  if (value !== userForm.pass) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
// 自定义校验规则----校验原密码是否正确
const validateOldPass = (rule: any, value: any, callback: any) => {
  rule = rule
  reqCheckPwd({ userId: userStore.user?._id as string, password: value }).then(
    (response) => {
      if (response.status == 0) {
        callback()
      } else {
        callback(new Error(response.msg))
      }
    },
  )
}
// 表单校验规则
const rules = reactive<FormRules>({
  oldPass: [
    { required: true, validator: validateOldPass, trigger: ['blur', 'change'] },
  ],
  pass: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  checkPass: [{ required: true, validator: validatePass, trigger: 'change' }],
})
// 打开修改密码对话框
const handlePwd = () => {
  dialogFormVisible.value = true
  // 当页面中的dom元素加载完毕会执行回到函数
  nextTick(() => {
    // 重置表单
    userFormRef.value.resetFields()
  })
}
// 修改密码
const updatePwd = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      reqUpdatePwd({
        userId: userStore.user?._id as string,
        password: userForm.pass,
      }).then((response) => {
        if (response.status == 0) {
          handleLogout()
          dialogFormVisible.value = false
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const handleCommand = (command: string | number | object) => {
  switch (command) {
    case 'a':
      // 修改密码
      handlePwd()
      break
    case 'b':
      // 退出登录
      handleLogout()
      break

    default:
      break
  }
}
let currentTime = ref<string>('')
const getTime = () => {
  setInterval(() => {
    currentTime.value = formateTime(Date.now())
  }, 1000)
}
// 退出登录
const handleLogout = () => {
  userStore.removeUser()
  if (!userStore.user) {
    $router.replace('/login')
  }
}
onMounted(() => {
  getTime()
})
</script>

<style scoped>
.logo {
  width: 25px;
  height: 25px;
  vertical-align: middle;
  padding: 0 10px 0 40px;
}

.title {
  position: absolute;
  color: #fff;
}

.el-dropdown {
  float: right;
  margin-right: 40px;
  height: 50px;
  line-height: 50px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}

.date {
  float: right;
  color: #fff;
  margin-right: 50px;
}
</style>
