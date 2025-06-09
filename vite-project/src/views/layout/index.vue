<template>
  <div class="layout-container">
    <AppHeader />
    <div class="layout-body">
    <AppNavbar />
    <AppMain /></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from "@/components/AppHeader.vue"
import AppNavbar from "@/components/AppNavbar.vue"
import AppMain from "@/components/AppMain.vue"

export default defineComponent({
  components: {
    AppHeader,
    AppNavbar,
    AppMain
  }
})
</script>
<style scoped>
.layout-container {
  /* 让布局占满视口高度 */
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa; /* 页面整体浅灰背景，可根据设计调整 */
}

.layout-body {
  display: flex;
  flex: 1; /* 填充顶栏下方剩余空间 */
}
</style>