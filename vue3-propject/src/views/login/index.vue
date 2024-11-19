<template>
  <div class="login-container">
    <el-form
      :model="form"
      ref="ruleFormRef"
      label-width="80px"
      class="login-form"
      :rules="rules"
    >
      <h2 class="login-title">登录</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入4-12位的账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        />
      </el-form-item>

      <el-form-item>
        <el-button style="background-color: #e96101;border: none;margin: 5px 70px;transform: scale(1.5)" type="primary" @click="onSubmit(ruleFormRef)"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const $router = useRouter()
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()

const ruleFormRef = ref<FormInstance>()
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
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
  ],
})

// 收集表单数据的对象
const form = reactive({
  username: '',
  password: '',
})
// 点击登录按钮的回调
const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      // 表单校验成功
      try {
        // 登录成功
         await userStore.userLogin(form)
        $router.replace('/')
        ElMessage({
          type: 'success',
          message: '登录成功',
        })
        //    强制刷新页面，防止左侧列表不显示最新内容
        location.reload()
      } catch (error) {
        ElMessage({
            type:'error',
            message:(error as Error).message
        })
      }
    } else {
      // 校验失败
      console.log('error submit!', fields)
    }
  })
}
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  overflow: hidden;
  border-radius: 20px;
}

.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #242424;
  overflow: hidden;
}
.el-input__wrapper{
  color:#2f2f2f ;
}
.login-title {
  text-align: center;
}
</style>
