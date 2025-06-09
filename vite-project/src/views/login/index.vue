<template>
  <div class="login-container">
    <!-- 登录 -->
    <el-card class="login-card" shadow="hover">
      <h3 class="login-title">用户登录</h3>
      <el-form
        :model="form"
        ref="ruleFormRef"
        label-position="left"
        label-width="0"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="User"
            placeholder="请输入用户名(4-12位)"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            prefix-icon="Lock"
            placeholder="请输入密码"
            @keyup.enter="onSubmit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";

// 直接获取 store 实例
const userStore = useUserStore();
const router = useRouter();

// 表单数据
const form = reactive({
  username: "",
  password: "",
});

// 表单引用
const ruleFormRef = ref();

// 表单校验规则（纯 JavaScript 写法，无需类型声明）
const rules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
    {
      validator(rule, value, callback) {
        const trimmedValue = value.trim();
        if (trimmedValue.length < 4 || trimmedValue.length > 12) {
          callback(new Error("长度需在4至12位之间"));
        } else if (!/^[a-zA-Z0-9_]+$/.test(trimmedValue)) {
          callback(new Error("账号必须由英文字母、数字或下划线组成"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
};

// 登录处理函数
const onSubmit = () => {
  // 通过 $refs 获取表单实例（无需类型声明）
  const formEl = ruleFormRef.value;
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      // 表单校验成功
      try {
        // 登录成功
        await userStore.userLogin(form);

        ElMessage({
          type: "success",
          message: "登录成功",
        });
        //    强制刷新页面，防止左侧列表不显示最新内容
        await router.replace("/");
        location.reload();
      } catch (error) {
        ElMessage({
          type: "error",
          message: error.message,
        });
      }
    } else {
      // 校验失败
      console.log("error submit!", fields);
    }
  });
};
</script>


<style scoped>
/* 基础样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  padding: 20px;
}

/* 登录卡片样式 */
.login-card {
  width: 380px;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(64, 158, 255, 0.1);
  background-color: white;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 30px;
}

/* 输入框样式 */
.el-input {
  height: 44px;
}

.el-input__inner {
  height: 44px;
  border-radius: 6px;
  border-color: #dcdfe6;
  transition: border-color 0.2s ease;
}

.el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 按钮样式 */
.login-button {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 18px;
  background-color: #409eff;
  border-color: #409eff;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.login-button:active {
  background-color: #3a8ee6;
  border-color: #3a8ee6;
}

/* 表单操作区样式 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 25px;
  padding: 0 5px;
}

.forgot-password {
  color: #409eff;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #66b1ff;
}
</style>