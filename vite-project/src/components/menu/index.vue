<template>
    <div>
        <template v-for="item in menuList" :key="item.index">
            <!-- 一级菜单 -->
            <el-menu-item v-if="!item.children" :index="item.index">
                <!-- 利用作用域插槽显示图标和文字 -->
                <template #title>
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                    <span>{{ item.title }}</span>
                </template>
            </el-menu-item>
            <!-- 二级菜单 -->
            <el-sub-menu v-if="item.children" :index="item.index">
                <template #title>
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                    <span>{{ item.title }}</span>
                </template>
                <!-- 规格使用此组件，将二级菜单中的children数组通过props传递进去，生成二级菜单 -->
                <Menu :menuList="item.children"/>
            </el-sub-menu>
        </template>
    </div>
</template>

<!-- 由于这个组件需要递归使用，所以不能使用setup语法糖，因为要给这个组件设置名称 -->
<script lang="ts">
    export default {
        name: "Menu",
        props: ["menuList"],
    };
</script>

<style scoped>
.el-menu-item {
  border: 0;
  background: rgb(0,0,0,0);

}
</style>

