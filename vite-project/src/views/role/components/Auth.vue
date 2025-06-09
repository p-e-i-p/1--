<template>
    <div>
        <el-form
            ref="roleFormRef"
            style="max-width: 400px"
            :model="updateRole"
            :rules="rules"
            label-width="100px">
            <el-form-item label="角色名称" prop="name">
                <el-input
                    v-model="updateRole.name"
                    placeholder="请输入角色名称" />
            </el-form-item>
        </el-form>
        <!-- 树形控件 -->
        <el-tree
            :data="authList"
            show-checkbox
            node-key="index"
            :default-expand-all="true"
            :default-checked-keys="checkedKeys"
            @check-change="handleCheckChange" />
    </div>
</template>
<script setup lang="ts">
    import { reactive, ref, onMounted } from "vue";
    import type {  FormInstance,FormRules } from "element-plus";
    import menuList from "@/config/menuConfig";
import { roleInfoData } from "@/api/role/type";
    interface Tree {
        name: string;
        index:string
    }
    // 接收父组件传递过来的数据
    const props = defineProps(["role"]);

    const roleFormRef = ref<FormInstance>();
    const rules = reactive<FormRules>({
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    });
    // 收集更新之后的角色数据
    let updateRole: roleInfoData = reactive({
        name: "",
    });
    // 树形控件数据列表
    const authList = ref([]);
    // 树形控件选中项数组
    let checkedKeys = reactive<any>([]);
    // 处理树形控件元素内容
    const getAuthNodes = (menuList: any) => {
        return menuList.map((item:any) => {
            if (!item.children) {
                return {
                    index: item.index,
                    label: item.title,
                };
            } else {
                return {
                    index: item.index,
                    label: item.title,
                    children: getAuthNodes(item.children),
                };
            }
        });
    };
    // 树形控件选中与取消选中事件回调
    const handleCheckChange = (
        data: Tree,
        checked: boolean,
        _indeterminate: boolean
    ) => {
        if(checked){
            // 如果不是学员和已经添加过的元素,再向数组中添加
            if(data.index != "/students" && checkedKeys.indexOf(data.index) == -1){
                // 如果勾选就将当前选中项的index添加到选中项数组中
                checkedKeys.push(data.index)
            }
        }else{
            // 如果当前元素的index在checkedKeys数组中存在，再进行删除
            if(checkedKeys.indexOf(data.index) != -1){
                // 如果取消选中就从选中项数组中删除，参数1：从哪个索引删除，参数2：删除几个
                checkedKeys.splice(checkedKeys.indexOf(data.index),1)
            }
        }
    };
    // 为父组件提供数据，更改之后的角色对象
    const getMenus = ()=>{
       updateRole.menus = checkedKeys 
       return updateRole
    }
    // 组件对象内的数据默认是对外关闭的，如果需要将某些数据或者方法对外提供需要借助下面的api对外暴露
    defineExpose({
        getMenus
    })
    onMounted(() => {
        authList.value = getAuthNodes(menuList);
        // 从父组件接收到的角色对象数据赋值给更新角色对象，用于初始化时展示数据
        updateRole = reactive({ ...props.role });
        // 树形控件默认选中项数组赋值
        checkedKeys = [...props.role.menus];
    });
</script>

<style scoped></style>
