<script setup lang="ts">
import {onMounted, ref} from "vue";
import {userCouponsInfo,} from "../../api/coupon.ts";
import {ArrowRight} from "@element-plus/icons-vue";
import {router} from "../../router";
import "../../style/base.css"
const couponData = ref();

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);

function loadCoupons(page: number) {
  userCouponsInfo(page - 1).then(res => {
    couponData.value = res.data.result.content;
    totalItems.value = res.data.result.totalElements;
    console.log(couponData.value[0]);
  });
}

onMounted(() => {
  loadCoupons(currentPage.value);
});

function handlePageChange(page: number) {
  currentPage.value = page;
  loadCoupons(page);
}


function couponTypeFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满减券";
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券";
  } else {
    return 'invalid coupon type';
  }
}

function couponContentFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满 " + row.full + " 减 " + row.reduction;
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券 标准";
  } else {
    return 'invalid coupon type';
  }
}


</script>

<template>
  <el-main>
    <el-row justify="center">
      <div class="customer-title">在这里查看已领取的优惠券 (●'◡'●)</div>
    </el-row>
    <el-row justify="center">
      <el-table :data="couponData" class="coupon-table" :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
        <el-table-column prop="storeName" label="所属商店" width="180px">
          <template #default="scope">
            <el-link @click="router.push('/storeDetail/'+scope.row.storeId)">
              <el-text>{{ scope.row.storeName }}</el-text>
              <el-text size="small">
                <el-icon>
                  <ArrowRight/>
                </el-icon>
              </el-text>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="effectiveTime" label="生效日期"/>
        <el-table-column prop="expiredTime" label="截止日期"/>
        <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>
        <el-table-column label="状态">
          <template #default="scope">
            <el-text v-if="scope.row.effective==2" style="color: forestgreen">√生效中</el-text>
            <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
            <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
          </template>
        </el-table-column>
      </el-table>

    </el-row>
    <el-row justify="center">
      <div>
        <el-pagination
            layout="prev, pager, next"
            :page-count="Math.ceil(totalItems / pageSize)"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-row>
  </el-main>


</template>

<style scoped>

.coupon-table {
  width: 60%;
  margin: 20px;
}
</style>