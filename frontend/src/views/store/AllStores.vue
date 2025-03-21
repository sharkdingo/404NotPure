<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {storesPageInfo, type StoresInfo} from "../../api/store.ts";

const storeList = ref([] as StoresInfo);
const currentPage = ref(1 as number);
const pageSize = ref(5 as number);
const totalItems = ref(0 as number);

function loadStores(page: number) {
  storesPageInfo(page - 1, pageSize.value).then(res => {
    totalItems.value = res.data.result.totalElements;
    storeList.value = res.data.result.content;
  });
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadStores(page);
}

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to the first page
  loadStores(currentPage.value);
}

onMounted(() => {
  loadStores(currentPage.value);
});

</script>

<template>
  <el-main class="page-main">
    <div v-for="store in storeList">
      <el-row justify="center">
        <el-card style="width: 800px" class="card" shadow="never">
          <template #header>
            <el-row align="middle">
              <el-col :span="22">
                <el-text size="large">{{ store.storeName }}</el-text>
              </el-col>
              <el-col :span="2">
                <router-link :to="'/storeDetail/'+store.storeId" v-slot="{navigate}" class="no-link">
                  <el-button type="primary" @click="navigate">进店</el-button>
                </router-link>

              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="7">
              <el-image style="width: 100px; height: 100px;border-radius: 6px" :src="store.imgURL" :fit="'cover'"/>
            </el-col>
            <el-col :span="12">
              <el-text line-clamp="4">{{ store.description }}</el-text>
            </el-col>
          </el-row>

        </el-card>
      </el-row>
    </div>
    <el-row justify="center">
      <div class="example-pagination-block">
        <el-pagination
            layout="prev, pager, next"
            :page-count="Math.ceil(totalItems / pageSize)"
            :current-page="currentPage"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
        />
      </div>
    </el-row>
  </el-main>

</template>


<style scoped>
.page-main {
  position: absolute;
  top: 52px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
}


.card {
  margin: 5px;
}

</style>
