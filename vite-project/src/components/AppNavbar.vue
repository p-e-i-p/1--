<template>
  <aside class="app-navbar">
    <div class="navbar">
      <el-menu
        background-color=" #60a5fa"
         active-text-color="#393939"
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        text-color="#fff"
        :router="true"
        :default-openeds="['/students']"
      >
        <Menu :menuList="menuNodes" />
      </el-menu>
    </div>
  </aside>
</template>

<script setup lang="ts">
    import menuList from "@/config/menuConfig";
    import Menu from "./menu/index.vue";
    import { MenuChildrenData, MenuData } from "./types/type";
    // 引入路由对象
    import { useRoute } from "vue-router";
    let $route = useRoute()
    // 引入用户小仓库
    import useUserStore from "@/store/modules/user";
    let userStore = useUserStore();
    // 判断当前登录用户是否拥有这个权限
    const hasAuth = (item: MenuData) => {
        // 从item（menuList）某一个元素中取出index和isPublic进行判断
        const { index, isPublic } = item;
        // 获取当前登录用户的权限列表
        const menus = userStore.user?.role?.menus;
        // 获取当前登录的用户名
        const username = userStore.user?.username;
        /* 
  判断
  1，当前登录的用户是admin
  2，当前菜单项是公共的 isPublic为true
  3，用户权限列表中包含此item（当前的菜单项）
  */
        if (username == "admin" || isPublic || menus?.indexOf(index) != -1) {
            return true;
        } else if (item.children) {
            return !!item.children.find((child: MenuChildrenData) => menus.indexOf(child.index) != -1)
        } else {
            return false;
        }
    };
    // 定义一个数组，用来存储需要展示的菜单项
    let menuNodes:any[] = []
    // 定义一个函数用来判断需要展示的菜单项
    const getMenuNodes = ()=>{
      menuList.forEach(item=>{
        if(!item.children){
          if(hasAuth(item)){
            menuNodes.push(item)
          }
        }else{
          // 定义遍历临时存储用户权限匹配的二级菜单
          let tempArr:any[] = []
          item.children.forEach(i=>{
            if(hasAuth(i)){
              tempArr.push(i)
            }
          })
          // 当循环遍历之后，tempArr中存储的就是所有需要展示的二级菜单项，需要赋值给students这个一级菜单项中的children属性
          let obj = {...item,children:tempArr}
          menuNodes.push(obj)
        }
      })
    }
    getMenuNodes()

    
</script>


<style scoped>
.app-navbar {
  width: 220px;
  background: linear-gradient(to bottom, #3b82f6, #60a5fa);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: calc(100vh - 60px); /* 减去顶栏高度 */
}

.el-menu {
  border: 0;
  background: linear-gradient(to bottom, #3b82f6, #60a5fa);

}
</style>