<script setup lang="ts">

import {Search, Filter, ArrowRight} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {router} from "../../router";
import {useRoute} from "vue-router";
import {ProductSearchInfo, searchProduct} from "../../api/product.ts";

const searchCtx = ref("");
const searchTypeSelect = ref('product');


const showDetail = ref(false);
const showFilterDrawer = ref(false);
const underFilter = ref(false);

const searchResult = ref(null as any);

const route = useRoute();

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(12);

let navigateBlock = false;

const filterType = ref("");
const filterLowerBound = ref<number>();
const filterUpperBound = ref<number>();

function navigate(path: string) {
  if (!navigateBlock) {
    router.push(path);
  }
}

function loadResult() {
  searchProduct({
    name: searchCtx.value,
  }, currentPage.value - 1, pageSize.value).then(res => {
    totalItems.value = res.data.result.totalElements;
    searchResult.value = res.data.result.content;
    console.log(res.data.result.content);
  });
}

onMounted(() => {
  if (route.query.ctx != null && typeof (route.query.ctx) == "string") {
    showDetail.value = true;
    {
      searchProduct({
        name: route.query.ctx as string,
      }, currentPage.value - 1, pageSize.value).then(res => {
        totalItems.value = res.data.result.totalElements;
        searchResult.value = res.data.result.content;
        console.log(res.data.result.content);
      });
    }
  }
});

function handlePageChange(page: number) {
  currentPage.value = page;
  loadResult();
}

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to the first page
  loadResult();
}

function toSearch() {
  searchResult.value = null;
  if (searchCtx.value != "") {
    router.push(`/search?ctx=${searchCtx.value}`);
    showDetail.value = true;
  } else {
    console.log("/s");
    router.push(`/search`);
    showDetail.value = false;
  }
  loadResult();
  handleClearFilter();
}

function handleToFilter() {
  if (filterType.value == "" && filterUpperBound.value == undefined && filterLowerBound.value == undefined) {
    return;
  }
  let info: ProductSearchInfo = {name: route.query.ctx as string};
  if (filterType.value != "") {
    info.type = filterType.value;
  }
  if (filterLowerBound.value != undefined) {
    info.lowerBound = filterLowerBound.value;
  }
  if (filterUpperBound.value != undefined) {
    info.upperBound = filterUpperBound.value;
  }
  searchProduct(info, currentPage.value - 1, pageSize.value).then(res => {
    totalItems.value = res.data.result.totalElements;
    searchResult.value = res.data.result.content;
    console.log(res.data.result.content);
  });
  underFilter.value = true;
  showFilterDrawer.value = false;
}

function handleClearFilter() {
  filterType.value = "";
  filterUpperBound.value = undefined;
  filterLowerBound.value = undefined;
  underFilter.value = false;
}

</script>

<template>
  <el-main class="main" id="main">
    <el-row justify="center" v-if="!showDetail" style="height: 240px">
      <img
          style="width: 80px"
          src="/src/assets/blueWhale.svg"
          alt="Element logo"
      />
      <el-text style="font-size: 40px;margin: 10px;font-family:fantasy">BlueWhale Search&nbsp;&nbsp;</el-text>

    </el-row>
    <el-row justify="center">
      <el-input
          v-model="searchCtx"
          style="max-width: 600px; margin: 10px"
          placeholder="蓝鲸一下，你就知道"
          class="input-with-select"
          @keyup.enter.native="toSearch"
      >
        <template #prepend>
          <el-select v-model="searchTypeSelect" style="width: 90px">
            <el-option label="搜商品" value="product"/>
            <el-option label="搜商店" value="store" disabled/>
          </el-select>
        </template>
        <template #append>
          <el-button @click="toSearch">
            <el-icon style="color: dodgerblue" :size="16">
              <Search/>
            </el-icon>
          </el-button>
        </template>
      </el-input>
    </el-row>


    <el-row justify="center" v-if="showDetail&&searchResult!=null">
      <div style="width: 90%;margin-top: 10px">
        <el-row justify="center">
          <el-card style="width: 300px" class="card"
                   @click="navigate('/productDetail/'+product.productId)"
                   v-for="product in searchResult" shadow="hover">
            <template #header>
              <el-row>
                <el-col :span="16">
                  <el-text line-clamp="1">{{ product.productName }}</el-text>
                </el-col>
                <el-col :span="8" style="text-align: end">
                  <el-text line-clamp="1">{{ product.price }}￥</el-text>
                </el-col>
              </el-row>
            </template>
            <el-image :src="product.imgURLs[0]" alt="" class="img" :fit="'cover'"/>
            <template #footer>
              <el-row>
                <el-col :span="12">
                  <el-link @click="navigate(`/storeDetail/${product.storeId}`);navigateBlock=true">
                    <el-text size="small" line-clamp="1">{{ product.storeName }}</el-text>
                    <el-text size="small">
                      <el-icon>
                        <ArrowRight/>
                      </el-icon>
                    </el-text>
                  </el-link>
                </el-col>
                <el-col :span="8"></el-col>
                <el-col :span="4" style="text-align: center">
                  <el-text size="small">{{ product.grade }}⭐</el-text>
                </el-col>
              </el-row>

            </template>
          </el-card>
        </el-row>

      </div>

    </el-row>
    <el-row justify="center" v-if="searchResult!=null&&searchResult.length==0">
      <div>
        <el-empty :image-size="200" description="什么都没有找到 ..."/>
      </div>
    </el-row>

    <el-row justify="center" v-else-if="showDetail">
      <div style="height: 90px"></div>
      <el-pagination
          layout="prev, pager, next"
          :page-count="Math.ceil(totalItems / pageSize)"
          :current-page="currentPage"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
      />
    </el-row>


  </el-main>

  <el-drawer v-model="showFilterDrawer" size="25%">
    <template #header>
      <el-text size="large">筛选</el-text>
    </template>

    <el-row>
      <el-text>商品类型</el-text>
    </el-row>
    <el-row>
      <el-select
          v-model="filterType"
          placeholder="选择"
          style="width: 180px;margin: 3px"
      >
        <el-option
            label="食品"
            value="FOOD"
        />
        <el-option
            label="服装"
            value="CLOTHES"
        />
        <el-option
            label="家具"
            value="FURNITURE"
        />
        <el-option
            label="电子产品"
            value="ELECTRONICS"
        />
        <el-option
            label="娱乐用品"
            value="ENTERTAINMENT"
        />
        <el-option
            label="体育用品"
            value="SPORTS"
        />
        <el-option
            label="奢侈品"
            value="LUXURY"
        />

      </el-select>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-text>最低价格</el-text>
    </el-row>
    <el-row>
      <el-input-number
          v-model="filterLowerBound"
          :min="0"
          controls-position="right"
          style="width: 180px;margin: 3px"
          size="small"
      />
    </el-row>
    <el-row>
      <div style="height: 10px"></div>
    </el-row>
    <el-row>
      <el-text>最高价格</el-text>
    </el-row>
    <el-row>
      <el-input-number
          v-model="filterUpperBound"
          :min="filterLowerBound"
          controls-position="right"
          style="width: 180px;margin: 3px"
          size="small"
      />
    </el-row>

    <template #footer>
      <el-button @click="showFilterDrawer=false">取消</el-button>
      <el-button type="danger" plain @click="handleClearFilter">清空筛选</el-button>
      <el-button type="primary" @click="handleToFilter">应用筛选</el-button>
    </template>

  </el-drawer>

  <el-backtop style="position: fixed; right: 30px;bottom: 160px" :visibility-height="100" target="#main"/>

  <el-button style="position: fixed; right: 30px;bottom: 100px" circle size="large"
             @click="showFilterDrawer=true;" v-if="!underFilter&&showDetail">
    <el-icon size="large">
      <Filter style="color: #409eff"/>
    </el-icon>
  </el-button>
  <el-button style="position: fixed; right: 30px;bottom: 100px" circle type="primary" size="large"
             @click="showFilterDrawer=true;" v-else-if="showDetail">
    <el-icon size="large">
      <Filter/>
    </el-icon>
  </el-button>


</template>

<style scoped>

.img {
  width: 100%;
  height: 160px;
}

.card {
  margin: 6px;
}

.main {
  overflow-y: scroll;
  position: absolute;
  left: 0;
  right: 0;
  top: 52px;
  bottom: 0;
}

</style>