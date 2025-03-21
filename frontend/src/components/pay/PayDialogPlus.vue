<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getBestInfo, payDisplayInfo} from "../../api/coupon.ts";
import {ElTable} from "element-plus";
import "../../style/base.css";
import {PayDisplayInfo, PayInfo, ProductsPassInfo} from "../../api/pay.ts";
import {uploadOrder} from "../../api/order.ts";
import {
  CircleCheckFilled,
  CirclePlus,
  Goods,
  ArrowDown,
  Van,
  Location,
  Minus
} from "@element-plus/icons-vue";

import ConfirmDialog from "../../components/pay/PayConfirmDialog.vue";

const confirmDialog = ref();

defineExpose({callPayDialog});
const emit = defineEmits(['payment-finish']);

const payBasicInfo = ref<PayInfo>({stores: [], couponId: 0, method: "DELIVERY"});
const payDetailedInfo = ref<PayDisplayInfo>();

const activeNames = ref([0]);

const method = ref('PICKUP');

const showDialog = ref(false);

function refreshInfo() {
  console.log("这是给后端的：");
  console.log(payBasicInfo.value);
  payDisplayInfo(payBasicInfo.value).then(res => {
    payDetailedInfo.value = res.data.result;
    console.log("这是后端返回的：");
    console.log(payDetailedInfo.value);
  });
}

const handleRowSelect = (row: any) => {
  if (row == null) {
    return;
  }
  if (row.selected) {
    return;
  }

  console.log("这是选中的行：");
  console.log(row);

  if (row.storeId == 0) {
    payBasicInfo.value.couponId = row.id;
  } else {
    let storeIdx = searchStoreId(payBasicInfo.value, row.storeId);
    if (storeIdx != -1) {
      payBasicInfo.value.stores[storeIdx].couponId = row.id;
    } else {
      console.log("search error");
    }
  }

  console.log("这是传给后端的：");
  console.log(payBasicInfo.value);
  refreshInfo();
};


function getBest() {
  getBestInfo(payBasicInfo.value).then(res => {
    if (res.data.code == "000") {
      ElMessage({
        message: "已自动选择最佳优惠",
        type: 'success',
        center: true,
      });
      console.log('666', res.data.result);
      handleAutoCoupon(res.data.result);
    } else {
      ElMessage({
        message: "请手动选择优惠",
        type: 'warning',
        center: true,
      });
      refreshInfo();
    }

  });
}

function handleAutoCoupon(autoCouponInfo: PayDisplayInfo) {
  payBasicInfo.value.couponId = autoCouponInfo.bestCoupon;
  for (let store of payBasicInfo.value.stores) {
    for (let storeInAutoInfo of autoCouponInfo.stores) {
      if (store.storeId == storeInAutoInfo.storeId) {
        store.couponId = storeInAutoInfo.bestCoupon;
      }
    }
  }
  refreshInfo();
}

function callPayDialog(payProducts: ProductsPassInfo) {
  payBasicInfo.value = {stores: [], couponId: 0, method: "DELIVERY"};// ?
  for (let payProduct of payProducts.products) {
    let storeId = payProduct.storeId;
    let productId = payProduct.productId;
    let num = payProduct.num;
    let idx = searchStoreId(payBasicInfo.value, storeId);
    if (idx < 0) {
      // 没找到
      payBasicInfo.value.stores.push({storeId: storeId, products: [], couponId: 0});
      idx = searchStoreId(payBasicInfo.value, storeId);
    }
    // 找到了
    payBasicInfo.value.stores[idx].products.push({productId: productId, num: num});
  }

  console.log(payBasicInfo.value);
  showDialog.value = true;
  getBest();
  // refreshInfo();
}

onMounted(() => {
  handleScrollDelay();
});

function searchStoreId(payInfo: PayInfo, storeId: number) {
  for (let a in payInfo.stores) {
    if (payInfo.stores[a].storeId == storeId) {
      // console.log("src: " + storeId + ", find " + a);
      return Number(a);
    }
  }
  // console.log("src: " + storeId + ", find nothing");
  return -1;
}

function submit() {
  uploadOrder(payBasicInfo.value).then(res => {
    if (res.data.code == '000') {
      ElMessage({
        message: "已成功提交",
        type: 'success',
        center: true,
      });
      console.log(res.data);
      showDialog.value = false;
      confirmDialog.value.callDialog(res.data.result);
    } else {
      console.log(res.data.msg);
      ElMessage({
        message: "提交失败，请稍后再试",
        type: 'error',
        center: true,
      });
    }
  });
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
    return "蓝鲸券 标准优惠";
  } else {
    return 'invalid coupon type';
  }
}


function calculateShowClear(storeId: number) {
  if (storeId == 0) {
    return payBasicInfo.value.couponId != 0;
  }
  let storeIdx = searchStoreId(payBasicInfo.value, storeId);
  if (storeIdx < 0) {
    return false;
  }
  return payBasicInfo.value.stores[storeIdx].couponId != 0;
}


function handleCouponSelectClear(storeId: number) {
  if (storeId == 0) {
    payBasicInfo.value.couponId = 0;
    refreshInfo();
    return;
  }
  let storeIdx = searchStoreId(payBasicInfo.value, storeId);
  if (storeIdx < 0) {
    return;
  }
  payBasicInfo.value.stores[storeIdx].couponId = 0;
  refreshInfo();
}

const tableRowClassName = ({row}: { row: any }) => {
  if (row.selected) {
    return 'success-row';
  }
  return '';
};

const showTip = ref(true);
const myScrollbar = ref();

const handleScroll = () => {
  // 防止Scrollbar实例为空
  if (!myScrollbar.value) {
    return;
  }
  // 判断是否滚动到底部附近
  let isScrollToEnd = Number(myScrollbar.value.wrapRef.scrollTop.toFixed(0))
      + Number(myScrollbar.value.wrapRef.clientHeight.toFixed(0))
      >= Number(myScrollbar.value.wrapRef.scrollHeight.toFixed(0)) - 20;

  showTip.value = !isScrollToEnd;
};

async function handleScrollDelay() {
  await Sleep(300);
  handleScroll();
}

const Sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

function handleClose() {

}


</script>

<template>


  <el-dialog
      v-model="showDialog"
      title="订单"
      width=60%
      @close="handleClose"
      :close-on-click-modal="false"
      top="10vh"
      class="radius1"
  >
    <el-row justify="center">
      <el-col style="text-align: center">
        <div class="price">
          <el-text v-if="payDetailedInfo?.totalBefore!=payDetailedInfo?.totalAfter" size="small">
            原价：{{ payDetailedInfo?.totalBefore }}
          </el-text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价格：
          <el-text size="large">{{ payDetailedInfo?.totalAfter }}</el-text>&nbsp;￥
        </div>
      </el-col>
    </el-row>
    <el-row>

    </el-row>
    <el-scrollbar height="500px" ref="myScrollbar" @scroll="handleScroll">
      <el-divider class="div">
        <el-text class="div-text">商品明细</el-text>
      </el-divider>
      <el-row justify="center">
        <el-collapse v-model="activeNames" style="width: 90%" @change="handleScrollDelay">
          <el-collapse-item v-for="(item,index) in payDetailedInfo?.stores" :name="index">
            <template #title>
              <el-icon size="16" style="margin-right: 6px;margin-left: 5px; color: goldenrod">
                <Goods/>
              </el-icon>
              <el-text style="">{{ item.storeName }}</el-text>
            </template>
            <el-row v-for="product in item.products">
              <el-col :span="1"></el-col>
              <el-col :span="17">
                <el-text>
                  {{ product.productName }}&nbsp;*{{ product.productNum }}
                </el-text>
              </el-col>
              <el-col :span="5" style="text-align: right">
                <el-text v-if="product.before==product.after">
                  {{ product.after }}￥
                </el-text>
                <el-text v-else>
                  <el-text tag="del" size="small" style="margin-right: 3px">{{ product.before }}￥</el-text>
                  {{ product.after }}￥
                </el-text>
              </el-col>
              <el-col :span="1"></el-col>

            </el-row>

            <el-row justify="center">
              <el-table :data="item.coupons" style="width: 80%" :cell-style="{'text-align':'center'}"
                        :header-cell-style="{'text-align':'center',height:'50px'}"
                        empty-text="暂无可用优惠 >_<"
                        @row-click="row=>handleRowSelect(row)" :row-class-name="tableRowClassName"
                        max-height="200">
                <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
                <el-table-column prop="expiredTime" label="截止日期"/>
                <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>
                <el-table-column label="状态">
                  <template #default="scope">
                    <el-text v-if="scope.row.effective==2" style="color: forestgreen">√可使用</el-text>
                    <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
                    <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template #header>
                    <el-button v-if="calculateShowClear(item.storeId)" size="small" type="danger"
                               @click="handleCouponSelectClear(item.storeId)" plain>
                      <el-icon>
                        <Minus/>
                      </el-icon>
                    </el-button>
                  </template>
                  <template #default="scope">
                    <el-icon v-if="scope.row.selected" style="" :size="20">
                      <CircleCheckFilled/>
                    </el-icon>

                    <el-icon v-else style="" :size="20">
                      <CirclePlus/>
                    </el-icon>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>

          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-divider class="div">
        <el-text class="div-text">全局优惠</el-text>
      </el-divider>

      <el-row justify="center">
        <el-table :data="payDetailedInfo?.coupons" style="width: 72%" :cell-style="{'text-align':'center'}"
                  :header-cell-style="{'text-align':'center',height:'50px'}"
                  empty-text="暂无可用优惠 >_<" :row-class-name="tableRowClassName"
                  @row-click="row=>handleRowSelect(row)" max-height="240">
          <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
          <el-table-column prop="expiredTime" label="截止日期"/>
          <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>
          <el-table-column label="状态">
            <template #default="scope">
              <el-text v-if="scope.row.effective==2" style="color: forestgreen">√可使用</el-text>
              <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
              <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template #header>
              <el-button v-if="calculateShowClear(0)" size="small" type="danger"
                         @click="handleCouponSelectClear(0)" plain>
                <el-icon>
                  <Minus/>
                </el-icon>
              </el-button>
            </template>
            <template #default="scope">
              <el-icon v-if="scope.row.selected" style="" :size="20">
                <CircleCheckFilled/>
              </el-icon>

              <el-icon v-else style="" :size="20">
                <CirclePlus/>
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-divider class="div">
        <el-text class="div-text">收货方式</el-text>
      </el-divider>
      <el-row justify="center">
        <el-card shadow="never" style="width: 80%">
          <el-row justify="center">
            <el-radio-group v-model="method">
              <el-radio value="PICKUP" style="margin-left: 50px;margin-right: 130px">
                <div style="display: flex;align-items: center">到店自提
                  <el-icon size="large" style="margin-left: 10px">
                    <Location/>
                  </el-icon>
                </div>
              </el-radio>
              <el-text style="color: silver">|</el-text>
              <el-radio value="DELIVERY" style="margin-left: 130px;margin-right: 50px">
                <div style="display: flex;align-items: center">快递送达
                  <el-icon size="large" style="margin-left: 10px">
                    <Van/>
                  </el-icon>
                </div>
              </el-radio>
            </el-radio-group>
            <!--            <el-col :span="16">-->
            <!--              <el-input :disabled="method=='PICKUP'" style="height: 100%" placeholder="填写详细地址"></el-input>-->
            <!--            </el-col>-->
          </el-row>

        </el-card>

      </el-row>
    </el-scrollbar>
    <el-row justify="center">

      <transition name="el-fade-in-linear">
        <div v-if="showTip" style="height: 25px;">
          <el-icon style="margin-top: 5px;" size="large">
            <ArrowDown/>
          </el-icon>
        </div>
      </transition>
      <div v-if="!showTip" style="height: 25px;">
      </div>
    </el-row>

    <template #footer>
      <div class="dialog-footer" style="margin-top: 5px">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submit">提交订单</el-button>

      </div>
    </template>
  </el-dialog>

  <ConfirmDialog ref="confirmDialog" @complete=""></ConfirmDialog>

</template>

<style scoped>
.price {
  margin-top: 10px;
  margin-bottom: 20px;
}

.div-text {
  color: cornflowerblue;
}

.div {
  margin: 30px auto 30px;
  width: 96%;

}
</style>

<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>