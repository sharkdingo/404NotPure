<script setup lang="ts">

function handleClose() {
  window.close();
}
</script>


<template>
  <el-main class="main-frame">
    <el-result
        icon="success"
        title="支付已完成"
        sub-title="您可以随时退出此页面"
    >
      <template #extra>
        <el-button @click="handleClose" type="primary">关闭页面</el-button>
      </template>
    </el-result>
  </el-main>
</template>


<style scoped>
.main-frame {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
