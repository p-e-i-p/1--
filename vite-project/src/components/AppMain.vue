<template>
  <main class="app-main">
  <router-view></router-view>
  </main>
</template>

<script lang="ts" setup>
// 主内容区组件逻辑
</script>

<style scoped>
.app-main {
  flex: 1;
  padding: 20px;
  background-color: white;
  overflow: auto;
  height: calc(100vh - 60px); /* 减去顶栏高度 */
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ring-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.chart-item {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: conic-gradient(var(--color) var(--percent), #e2e8f0 var(--percent));
}

.chart-item::before {
  content: '';
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: white;
}

.percent, .label {
  position: relative;
  z-index: 1;
}

.percent {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.label {
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>