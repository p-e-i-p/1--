<template>
  <div>
    <el-form
      :model="updateRole"
      ref="roleForm"
      label-width="100px"
      label-position="right"
      style="width: 400px"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="updateRole.name"
          placeholder="请输入角色名称"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 树形控件 -->
    <el-tree
      :data="authList"
      node-key="index"
      :default-expand-all="true"
      :default-checked-keys="checkedKeys"
      show-checkbox
      @check-change="handleCheckChange"
    />
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
// import type Node from 'element-plus/es/components/tree/src/model/node'
import menuList from '@/config/menuConfig.ts'
import type { roleInfoData } from '@/api/role/types'
import { reactive, ref, onMounted } from 'vue'
// 树形控件数据列表
const authList = ref([])
// 树形控件选中项数组
let checkedKeys = reactive<any>([])
// 表单元素对象
const roleForm = ref<FormInstance>()
// 表单校验规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
})
// 收集表单数据
let updateRole: roleInfoData = reactive({
  name: '',
})

// 接收父组件传递过来的要更新的角色原始数据
const props = defineProps(['role'])
interface Tree {
  name: string
  index: string
}
// 树形控件勾选回调
const handleCheckChange = (
  data: Tree,
  checked: boolean,
  indeterminate: boolean,
) => {
  indeterminate = indeterminate
  if (checked) {
    if (data.index != '/students' && checkedKeys.indexOf(data.index) == -1) {
      checkedKeys.push(data.index)
    }
  } else {
    if (checkedKeys.indexOf(data.index) != -1) {
      checkedKeys.splice(checkedKeys.indexOf(data.index), 1)
    }
  }
}
// 位父组件提供数据
const getMenus = () => {
  updateRole.menus = checkedKeys
  return updateRole
}
// 树形控件元素展示内容数组
const getAuthNode = (menuList: any) => {
  // [{index:"/home",label:"首页"},{index:"/user",label:"用户管理"}]
  return menuList.map((item: any) => {
    if (!item.children) {
      return {
        index: item.index,
        label: item.title,
      }
    } else {
      return {
        index: item.index,
        label: item.title,
        children: getAuthNode(item.children),
      }
    }
  })
}
onMounted(() => {
  authList.value = getAuthNode(menuList)
  updateRole = reactive({ ...props.role })
  checkedKeys = props.role.menus
})
// 对外提供数据
defineExpose({
  getMenus,
})
</script>

<style scoped></style>
