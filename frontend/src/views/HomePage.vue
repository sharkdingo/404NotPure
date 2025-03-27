<script setup lang="ts">

import {ArrowRight, Goods, Search} from "@element-plus/icons-vue";
import {router} from "../router";

const toSearch = () => {
  router.push({path: "/search"});
};

const toAllStore = () => {
  router.push({path: "/allStore"});
};

</script>

<template>
  <el-main>

    <div style="height: 20%"></div>
    <el-row justify="center">
      <img
          style="width: 100px"
          src="/src/assets/blueWhale.svg"
          alt="Element logo"
      />
    </el-row>
    <el-row justify="center">
      <el-text style="font-size: 50px;margin: 5px;font-family:fantasy">BlueWhale Market</el-text>
    </el-row>
    <div style="height: 10%"></div>
    <el-row justify="center">
      <el-button size="large" @click="toAllStore">
        <el-icon size="16" style="margin-right: 5px;margin-left: 2px">
          <Goods/>
        </el-icon>
        商店
        <el-icon style="margin-right: 2px;margin-left: 2px">
          <ArrowRight/>
        </el-icon>
      </el-button>

      <el-button size="large" @click="toSearch">
        <el-icon size="16" style="margin-right: 5px;margin-left: 2px">
          <Search/>
        </el-icon>
        搜索
        <el-icon style="margin-right: 2px;margin-left: 2px">
          <ArrowRight/>
        </el-icon>
      </el-button>
    </el-row>

  </el-main>


</template>

<style scoped>

</style>