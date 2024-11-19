<template>
  <div>
    <app-header class="header"></app-header>
    <app-navbar class="navbar"></app-navbar>
    <app-main class="main"></app-main>
  </div>
</template>
<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppNavbar from '@/components/AppNavbar.vue'
import AppMain from '@/components/AppMain.vue'
</script>

<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color:#292929 ;

  border-bottom:1px,solid,#e96101;
}
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  background-color:#292929 ;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  padding: 10px;
  overflow-y: auto;
}
</style>
