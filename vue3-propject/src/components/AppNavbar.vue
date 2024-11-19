<template>
  <div class="navbar">
    <el-menu
      active-text-color="#e96101"
      background-color="#e96101"
      class="el-menu-vertical-demo"
      text-color="#fff"
      :router="true"
      :default-openeds="['/students']"
      :default-active="$route.path"
    >
      <Menu :menuList="menuNodes" />
    </el-menu>
  </div>
</template>
<script setup lang="ts">
// 引入Menu子组件
import Menu from './menu/index.vue'
// 引入全都菜单数组
import menuList from '@/config/menuConfig'
// 引入数据类型
import type { MenuData, MenuChildrenData } from './types/type'
// 引入用户小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 引入路由
import { useRoute } from 'vue-router'
const $route = useRoute()
// 判断当前登录用户是否拥有权限
const hashAuth = (item: MenuData) => {
  // 获取menuList中的某一个元素
  const { index, isPublic } = item
  // 获取当前登录用户的权限列表
  // ["/home","/role","/school","/major"]
  const menus = userStore.user?.role.menus

  // 获取当前登录用户的用户名
  const username = userStore.user?.username

  /* 
    1,判断当前登录的用户是否位超级管理员 admin
    2，当前item是否位公共的 isPublic
    3，当前登录的用户权力列表当中是否包含item的index值
    */
  if (username == 'admin' || isPublic || menus?.indexOf(index) != -1) {
    return true
  } else if (item.children) {
    return !!item.children.find(
      (child: MenuChildrenData) => menus.indexOf(child.index) != -1,
    )
  } else {
    return false
  }
}

// 定义一个数组用于存储要展示的菜单项
let menuNodes: any[] = []
// 计算要展示的菜单项
const getMenuNodes = () => {
  menuList.forEach((item) => {
    if (!item.children) {
      if (hashAuth(item)) {
        menuNodes.push(item)
      }
    } else {
      // 用于存储与当前登录用户权限列表匹配的二级菜单
      let tempArr = []
      // 循环遍历二级菜单项数组
      item.children.forEach((i) => {
        // 如果当前循环遍历到的二级菜单项在登录的用户权限列表中存在，就添加到临时数组中
        if (hashAuth(i)) {
          tempArr.push(i)
        }
      })
      // 循环遍历结束后tempArr中存储的就是所有与当前登录用户权限列表匹配的二级菜单，赋值给students的children属性中
      // item.children = tempArr
      let obj = { ...item, children: tempArr }
      // 将拥有二级菜单的菜单项添加到menuNodes
      menuNodes.push(obj)
    }
  })
}

// [/user,/role,/school,/major]
getMenuNodes()
</script>

<style scoped>
.el-menu {
  border-right: 0;
}
.navbar > ul {
  background-color: rgba(242, 229, 229, 0);
  overflow: hidden;
}

.el-menu-item:hover {
  background-color: #e96101;
}
.el-sub-menu__title:hover {
  background-color: #e96101;
}
</style>
