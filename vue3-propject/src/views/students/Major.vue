<template>
  <div>
    <div style="margin: 20px 0">
      <el-button type="primary" @click="handleAdd">添加专业</el-button>
    </div>
    <el-table :data="majors" style="width: 100%; height: 380px">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="majorname" label="专业名称" />

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
    <!-- 添加/编辑专业对话框 -->
    <el-dialog v-model="majorFormVisible" title="添加/编辑专业" width="500px">
      <el-form
        :model="major"
        label-width="100px"
        label-position="right"
        ref="majorFormRef"
        :rules="rules"
        style="width: 400px"
      >
        <el-form-item label="专业名称" prop="majorname">
          <el-input v-model="major.majorname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="
              major._id == null
                ? addData(majorFormRef)
                : updateData(majorFormRef)
            "
          >
            确定
          </el-button>
          <el-button @click="majorFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { majorInfoData } from '@/api/major/types'
import { onMounted, ref, reactive, nextTick } from 'vue'
import useMajorStore from '@/store/modules/major'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
let majorStore = useMajorStore()
// 专业数据列表
const majors = ref<majorInfoData[] | undefined>([])
// 当前页码
const currentPage = ref(1)
// 每页显示多少条数据
const pageSize = ref(5)
// 数据总条数
const total = ref(0)
const majorFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  majorname: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
})
// 弹窗是否展示
const majorFormVisible = ref(false)
// 添加/编辑专业表单收集数据对象
const major = ref<majorInfoData>({
  _id: null,
  majorname: '',
})
// 添加专业弹窗展示
const handleAdd = () => {
  major.value = {
    _id: null,
    majorname: '',
  }
  majorFormVisible.value = true
  nextTick(() => {
    majorFormRef.value.resetFields()
  })
}
const addData = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      majorStore.addMajor(major.value as majorInfoData).then(() => {
        majorFormVisible.value = false
        getMajorList()
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
      majorStore.updateMajor(major.value as majorInfoData).then(() => {
        majorFormVisible.value = false
        getMajorList()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleEdit = (_id) => {
  handleAdd()
  majorStore.getMajorById(_id).then((response) => {
    major.value = response
  })
}
const handleDelete = (_id) => {
  ElMessageBox.confirm('确定要删除此条数据吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      majorStore.deleteMajor(_id).then(() => {
        // 重新获取数据刷新列表
        getMajorList()
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
// 获取专业列表
const getMajorList = () => {
  majorStore
    .getMajorList({ page: currentPage.value, size: pageSize.value })
    .then((response) => {
      majors.value = majorStore.majors
      total.value = response?.total as number
    })
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getMajorList()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getMajorList()
}
onMounted(() => {
  getMajorList()
})
</script>

<style scoped></style>
