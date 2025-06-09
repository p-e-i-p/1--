<template>
  <header class="app-header">
    <div class="header-left">
      <el-button type="text" class="menu-button">
        <el-icon><Menu /></el-icon>
      </el-button>
      <div class="system-title">学员管理系统</div>
    </div>
    <div class="header-right">
      <span class="date">{{ currentTime }}</span>
      <!-- 下拉菜单 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userStore.user.username }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="a">修改密码</el-dropdown-item>
            <el-dropdown-item command="b">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          label-width="100px"
          label-position="right"
          style="width: 400px"
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
          <div class="dialog-footer">
            <el-button type="primary" @click="onSubmit(userFormRef)">
              提交
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { type FormInstance, type FormRules } from "element-plus";
import { formateTime } from "@/utils/dateUtils";
import useUserStore from "@/store/modules/user";
import { useRouter } from "vue-router";
    import { reqCheckPwd, reqUpdatePwd } from "@/api/user";
const $router = useRouter();
const emit = defineEmits(["toggle-sidebar"]);
let userStore = useUserStore();
// 表单ref对象
const userFormRef = ref<FormInstance>();
// 定义一个响应式ref对象数据，控制修改密码弹窗是否展示
let dialogFormVisible = ref(false);
// 收集表单中输入框输入的内容对象
const userForm = reactive({
  oldPass: "", //原始面貌
  pass: "", // 新密码
  checkPass: "", //确认密码
});
// 自定义校验规则，用于发送Ajax请求校验原密码是否正确
const validateOldPass = (_rule: any, value: any, callback: any) => {
  reqCheckPwd({
    userId: userStore.user?._id as string,
    password: value,
  }).then((response) => {
    if (response.status == 0) {
      callback();
    } else {
      callback(new Error(response.msg));
    }
  });
};
// 自定义校验规则，用于校验确认密码和新密码是否一致
const validatePass = (_rule: any, value: any, callback: any) => {
  if (value != userForm.pass) {
    callback(new Error("两次输入密码不一致"));
  } else {
    callback();
  }
};
// 表单校验规则
const rules = reactive<FormRules>({
  oldPass: [{ required: true, validator: validateOldPass, trigger: "blur" }],
  pass: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      min: 4,
      message: "请输入4位以上长度的密码",
      trigger: ["blur", "change"],
    },
  ],
  checkPass: [{ required: true, validator: validatePass, trigger: "blur" }],
});
const handleCommand = (command: string) => {
  switch (command) {
    case "a":
      openDialog();
      break;
    case "b":
      handleLogout();
      break;
  }
};
const openDialog = () => {
  dialogFormVisible.value = true;
  nextTick(() => {
    userFormRef.value?.resetFields();
  });
};
const handleLogout = () => {
  userStore.removeUser();
  if (!userStore.user) {
    $router.replace("/login");
  }
};
   // 提交按钮
    const onSubmit = async (formEl: FormInstance | undefined) => {
        if (!formEl) return;
        await formEl.validate(async (valid, _fields) => {
            if (valid) {
                reqUpdatePwd({userId:userStore.user?._id as string,password:userForm.pass}).then(response=>{
                    if(response.status == 0){
                        // 修改密码成功，需要将仓库中存储的用户信息清空，所以调用退出登录方法
                        handleLogout()
                        // 关闭弹窗
                        dialogFormVisible.value = false
                    }
                })
            } else {
                
            }
        });
    };
let currentTime = ref<string>("");
    // 定时器id
    let timer: any = null;
const getTime = () => {
  timer=setInterval(() => {
    currentTime.value = formateTime(Date.now());
  }, 1000);
};
onMounted(() => {
  getTime();
});
 onUnmounted(() => {
        clearInterval(timer);
        timer = null;
    });
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background: linear-gradient(to right, #3b82f6, #60a5fa);
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-button {
  color: white !important;
}

.system-title {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  margin: 0 8px;
}

.date {
  float: right;
  color: #fff;
  margin-right: 50px;
}
</style>