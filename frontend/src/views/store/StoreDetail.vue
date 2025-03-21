<script setup lang="ts">
import {storeInfoDetail, type StoreInfoDetail} from "../../api/store.ts";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ArrowLeft} from "@element-plus/icons-vue";
import {storeCouponNumInfo, uploadReceiveCouponsInfo, userStoreCouponsInfo} from "../../api/coupon.ts";
import {progressColors} from "../../style/style.ts";
import {router} from "../../router";

const role = sessionStorage.getItem("role");

const storeDetail = ref({} as StoreInfoDetail);
const grade = ref<number>();
const storeId = ref();

const badgeCnt = ref(0);
const showCouponsDialog = ref(false);

const couponData = ref();
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(5);

function navigate(path: string) {
  router.push(path);
}

function loadStoreDetail(x: number) {
  storeInfoDetail(x).then(res => {
    storeDetail.value = res.data.result;
    grade.value = Number(storeDetail.value.grade);
    storeId.value = res.data.result.storeId;

    loadStoreCoupons(currentPage.value);


  });
}

onMounted(() => {
  const storeId = Number(useRoute().params.storeId);
  loadStoreDetail(storeId);
});

function couponContentFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满 " + row.full + " 减 " + row.reduction;
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券 标准";
  } else {
    return 'invalid coupon type';
  }
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

function receiveCoupon(id: number) {
  uploadReceiveCouponsInfo(id).then(res => {
    if (res.data.code == '000') {
      loadStoreCoupons(currentPage.value);
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

function loadStoreCoupons(page: number) {
  if (role == "CUSTOMER") {
    userStoreCouponsInfo(page - 1, pageSize.value, storeId.value).then(res => {
      couponData.value = res.data.result.content;
      totalItems.value = res.data.result.totalElements;
      getCouponCnt();
    });
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadStoreCoupons(page);
}

function getCouponCnt() {
  storeCouponNumInfo(storeId.value).then(res => {
    badgeCnt.value = res.data.result;
  });
}
</script>


<template>
  <el-container>
    <el-aside width="25%" class="page-aside">

      <el-row justify="center" align="middle" style="margin-top: 10px;margin-bottom: 20px">
        <el-col :span="1"></el-col>
        <el-col :span="3" style="text-align: center">
          <el-button circle @click="router.push('/allStore')">
            <el-icon  :size="20">
              <ArrowLeft/>
            </el-icon>
          </el-button>
        </el-col>
        <el-col :span="17" style="text-align: center">
          <el-text style="font-size: 17px;color: cornflowerblue;">{{ storeDetail.storeName }}</el-text>
        </el-col>
        <el-col :span="3"></el-col>
      </el-row>

      <el-row justify="center" class="grade-stars">
        <el-rate
            v-model="grade"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} points"
        />
      </el-row>
      <el-row justify="center">
        <el-image class="storeImg" :src="storeDetail.imgURL" :fit="'cover'"/>
      </el-row>
      <el-row>
        <el-text class="description">{{ storeDetail.description }}</el-text>
      </el-row>
      <el-row style="height: 20px">
      </el-row>
      <el-row justify="center" v-if="role=='CUSTOMER'">
        <el-badge :value="badgeCnt" type="primary" :show-zero="false">
          <el-button @click="showCouponsDialog= true">本店优惠券</el-button>
        </el-badge>

      </el-row>
    </el-aside>

    <el-main class="page-main">
      <el-row>
        <el-card style="height: 320px;width: 360px" class="card" @click="navigate('/productDetail/'+product.productId)"
                 v-for="product in storeDetail.products" shadow="hover">
          <template #header>
            <el-row>
              <el-col :span="20">
                <el-text size="large" line-clamp="1">{{ product.productName }}</el-text>
              </el-col>
              <el-col :span="4" style="text-align: center">
                <el-text line-clamp="1" style="margin-top: 2px">{{ product.price }}￥</el-text>
              </el-col>
            </el-row>
          </template>
          <el-image :src="product.imgURLs[0]" alt="" class="img" :fit="'cover'"/>
        </el-card>
      </el-row>

    </el-main>
  </el-container>


  <el-dialog
      v-model="showCouponsDialog"
      title="本店可领取优惠券"
      width="60%"
  >
    <el-row justify="center">
      <el-table :data="couponData" class="coupon-table" style="width: 90%; min-height: 300px"
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
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
        <el-table-column label="">
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

  </el-dialog>
</template>


<style scoped>
.grade-stars {
  margin-top: 1px;
  margin-bottom: 30px;
}


.page-aside {
  border-right: lightgrey solid 1px;
  position: absolute;
  left: 0;
  top: 51px;
  bottom: 0;
}

.page-main {
  position: absolute;
  left: 25%;
  right: 0;
  top: 52px;
  bottom: 0;
  overflow-y: scroll;
}

.storeImg {
  width: 320px;
  height: 300px;
  margin-left: 20px;
  margin-right: 20px;
  max-height: 360px;
}

.description {
  margin: 30px;
}

.card {
  margin: 6px;
}

a {
  text-decoration: none;
}

.img {
  width: 100%;
  height: 210px;
  border-radius: 6px
}
</style>