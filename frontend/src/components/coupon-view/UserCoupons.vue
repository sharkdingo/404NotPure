<script setup lang="ts">
import {onMounted, ref} from "vue";
import {couponsInfo, uploadReceiveCouponsInfo} from "../../api/coupon.ts";
import {progressColors} from "../../style/style.ts";
import "../../style/base.css"

const couponData = ref();

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);

function loadCoupons(page: number) {
  couponsInfo(page - 1).then(res => {
    couponData.value = res.data.result.content;
    totalItems.value = res.data.result.totalElements;
    console.log(res.data.result.content);
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

function receiveCoupon(id: number) {
  uploadReceiveCouponsInfo(id).then(res => {
    if (res.data.code == '000') {
      loadCoupons(currentPage.value);
      ElMessage({
        message: "已领取",
        type: 'success',
        center: true,
      });
    } else {
      ElMessage({
        message: "领取失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
  });
}


</script>

<template>
  <el-main>
    <el-row justify="center">
      <div class="customer-title">在这里领取商场优惠券</div>
    </el-row>
    <el-row justify="center">
      <el-table :data="couponData" class="coupon-table" :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
        <el-table-column prop="storeName" label="所属商店" width="180"/>
        <el-table-column prop="effectiveTime" label="生效日期"/>
        <el-table-column prop="expiredTime" label="截止日期"/>
        <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>

        <el-table-column label="领取状态">
          <template #default="scope">
            <el-progress :percentage="scope.row.allCouponNum==0?0:scope.row.currentCouponNum*100/scope.row.allCouponNum"
                         :color="progressColors">
              <el-text size="small">{{ scope.row.currentCouponNum }} / {{ scope.row.allCouponNum }}</el-text>
            </el-progress>

          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template #default="scope">
            <el-text v-if="scope.row.effective==2" style="color: forestgreen">√生效中</el-text>
            <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
            <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
          </template>
        </el-table-column>
        <el-table-column label="" fixed="right">
          <template #default="scope">
            <el-button
                v-if="scope.row.received==false&&scope.row.effective>0&&!scope.row.used&&scope.row.currentCouponNum"
                size="small"
                type="primary"
                @click="receiveCoupon(scope.row.id)">
              领取
            </el-button>
            <el-text v-else-if="scope.row.received==true&&!scope.row.used" style="color: #13ce66" size="large">√
            </el-text>
            <el-text v-else-if="scope.row.used" style="color: lightgray" size="small">已使用</el-text>
            <el-text v-else-if="!scope.row.currentCouponNum" style="color: lightgray" size="small">已领完</el-text>
            <el-text v-else size="small" style="color: lightgray">不可领取</el-text>
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
  width: 80%;
  margin: 20px;
}

</style>