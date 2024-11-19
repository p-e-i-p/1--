<template>
  <div>
    <div style="margin: 20px 0">
      <el-button type="primary" @click="handleAdd">添加学校</el-button>
    </div>
    <el-table :data="schools" style="width: 100%; height: 380px">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="schoolname" label="学校名称" />

      <el-table-column fixed="right" label="Operations">
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
    <!-- 添加/编辑学校对话框 -->
    <el-dialog v-model="schoolFormVisible" title="添加/编辑学校" width="500px">
      <el-form
        :model="school"
        label-width="100px"
        label-position="right"
        ref="schoolFormRef"
        :rules="rules"
        style="width: 400px"
      >
        <el-form-item label="学校名称" prop="schoolname">
          <el-input v-model="school.schoolname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="
              school._id == null
                ? addData(schoolFormRef)
                : updateData(schoolFormRef)
            "
          >
            确定
          </el-button>
          <el-button @click="schoolFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { schoolInfoData } from '@/api/school/types'
import { onMounted, ref, reactive, nextTick } from 'vue'
import useSchoolStore from '@/store/modules/school'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
let schoolStore = useSchoolStore()
// 学校数据列表
const schools = ref<schoolInfoData[] | undefined>([])
// 当前页码
const currentPage = ref(1)
// 每页显示多少条数据
const pageSize = ref(5)
// 数据总条数
const total = ref(0)
const schoolFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  schoolname: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
})
// 弹窗是否展示
const schoolFormVisible = ref(false)
// 添加/编辑学校表单收集数据对象
const school = ref<schoolInfoData>({
  _id: null,
  schoolname: '',
})
// 添加学校弹窗展示
const handleAdd = () => {
  school.value = {
    _id: null,
    schoolname: '',
  }
  schoolFormVisible.value = true
  nextTick(() => {
    schoolFormRef.value.resetFields()
  })
}
const addData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      schoolStore.addSchool(school.value as schoolInfoData).then(() => {
        schoolFormVisible.value = false
        getSchoolList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const updateData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      schoolStore.updateSchool(school.value as schoolInfoData).then(() => {
        schoolFormVisible.value = false
        getSchoolList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleEdit = (_id) => {
  handleAdd()
  schoolStore.getSchoolById(_id).then((response) => {
    school.value = response
  })
}
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除此条数据吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      schoolStore.deleteSchool(_id).then(() => {
        // 重新获取数据刷新列表
        getSchoolList()
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      })
    })
    .catch(() => {
      return false
    })
}
// 获取学校列表
const getSchoolList = () => {
  schoolStore
    .getSchoolList({ page: currentPage.value, size: pageSize.value })
    .then((response) => {
      schools.value = schoolStore.schools
      total.value = response?.total as number
    })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getSchoolList()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getSchoolList()
}
onMounted(() => {
  getSchoolList()
})
</script>

<style scoped></style>
