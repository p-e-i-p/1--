<template>
  <div>
    <template v-for="item in menuList" :key="item.index">
      <!-- 一级菜单 -->
      <el-menu-item v-if="!item.children" :index="item.index">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
      <!-- 包含多级菜单 -->
      <el-sub-menu v-if="item.children" :index="item.index">
        <template #title>
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <!-- 递归处理多级菜单 -->
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>
<script lang="ts">
// 因为递归组件必须要有名称，所以使用vue2的写法给当前组件起一个名字
export default {
  name: 'Menu',
  props: ['menuList'],
}
</script>
<!-- <script setup lang="ts">
defineProps['menuList']
</script> -->

<style scoped>
.navbar > ul div {
  background: #2f2f2f;
  
}
</style>
