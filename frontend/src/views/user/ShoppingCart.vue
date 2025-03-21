<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {ArrowRight, Goods, Minus} from "@element-plus/icons-vue";
import "../../style/base.css";

import {getShoppingCart, removeCartItem} from "../../api/shopping-cart.ts";
import {router} from "../../router";
import {ProductsPassInfo} from "../../api/pay.ts";
import PayDialog from "../../components/pay/PayDialogPlus.vue";
import {getBestPrice} from "../../api/coupon.ts";

const cartItems = ref([] as any);
const checked = ref([] as number[]);

const showRemoveConfirmDialog = ref(false);

const priceBefore = ref(0);
const priceAfter = ref(0);

onMounted(() => {
  getShoppingCart().then(res => {
    console.log(res.data.result);
    cartItems.value = res.data.result;
    for (let item of cartItems.value) {
      numArray.value.products.push({productId: item.productId, num: 1, storeId: item.storeId});
    }
  });
});


const numArray = ref<ProductsPassInfo>({products: []});

const resArray = computed(() => {
  let array: ProductsPassInfo = {products: []};
  for (let temp of numArray.value.products) {
    if (checked.value.includes(temp.productId)) {
      array.products.push(temp);
    }
  }
  return array;
});


function getNumArrayIdx(id: number) {
  for (let i in numArray.value.products) {
    if (numArray.value.products[i].productId == id) {
      return Number(i);
    }
  }
  return -1;
}

function handleChange() {
  getBestPrice(resArray.value).then(res => {
    console.log(res.data);
    priceBefore.value = res.data.result.totalBefore;
    priceAfter.value = res.data.result.totalAfter;
  });
}

const payDialog = ref();

function toPay() {
  payDialog.value.callPayDialog(resArray.value);
}

let toRemoveId = 0;
let toRemoveName = ref('');

function handleRemove() {
  removeCartItem(toRemoveId).then((res) => {
    if (res.data.code == "000") {
      ElMessage({
        message: "已成功移除",
        type: 'success',
        center: true,
      });
      showRemoveConfirmDialog.value = false;
      cartItems.value = res.data.result;
      numArray.value = {products: []};
      for (let item of cartItems.value) {
        numArray.value.products.push({productId: item.productId, num: 1, storeId: item.storeId});
      }
      checked.value = [];
    } else {
      console.log(res.data.msg);
      ElMessage({
        message: "移除失败，请稍后再试",
        type: 'warning',
        center: true,
      });
    }
  });
}
</script>

<template>

  <el-main class="main">
    <el-row justify="center">
      <div class="customer-title">在这里查看您的购物车</div>
    </el-row>
    <el-row justify="center" v-if="cartItems.length == 0">
      <div>
        <el-empty :image-size="200" description="什么都没有找到 ..."/>
      </div>
    </el-row>
    <el-row justify="center">

    </el-row>
    <div v-for="item in cartItems">
      <el-row justify="center">
        <el-card style="width: 800px" class="card" shadow="never">
          <template #header>
            <el-row align="middle">
              <el-col :span="2" style="text-align: center">
                <el-checkbox-group v-model="checked" @change="handleChange">
                  <el-checkbox label="" :value="item.productId" size="large">
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col :span="20">
                <el-text size="large">
                  {{ item.productName }}
                </el-text>
              </el-col>
              <el-col :span="2" style="text-align: center">
                <el-text size="large" style="display: flex;margin-top: 7px">
                  {{ item.price }}￥
                </el-text>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="2"></el-col>
            <el-col :span="6">
              <el-image style="width: 100px; height: 100px;border-radius: 6px" :src="item.imgURLs[0]" :fit="'cover'"/>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-link @click="router.push(`/storeDetail/${item.storeId}`)">
                  <el-text line-clamp="1">
                    <el-icon>
                      <Goods></Goods>
                    </el-icon>
                    {{ item.storeName }}&nbsp;
                  </el-text>
                  <el-text>
                    <el-icon>
                      <ArrowRight/>
                    </el-icon>
                  </el-text>
                </el-link>
              </el-row>
              <div style="height: 55px"></div>
              <el-row>
              </el-row>

              <el-row>
              </el-row>

            </el-col>
            <el-col :span="4">
              <el-row>
                <el-input-number v-model="numArray.products[getNumArrayIdx(item.productId)].num" :min="1" :max="99"
                                 size="small"
                                 @change="handleChange"/>
              </el-row>
              <div style="height: 55px"></div>
              <el-row justify="end">
                <el-button v-if="true" size="small" type="danger" style="margin-right: 10px"
                           @click="showRemoveConfirmDialog=true;toRemoveId=item.productId;toRemoveName=item.productName"
                           plain>
                  <el-icon>
                    <Minus/>
                  </el-icon>
                </el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-card>

      </el-row>
    </div>
    <el-row justify="center">


    </el-row>
  </el-main>

  <PayDialog ref="payDialog" @payment-finish=""></PayDialog>

  <transition name="el-fade-in-linear">
    <el-card class="float-card" shadow="never" v-if="checked.length>0">
      <el-row justify="center">
        <el-text style="margin-top: 5px" line-clamp="1">总金额：{{ priceBefore }}&nbsp;￥</el-text>
      </el-row>
      <el-row justify="center">
        <el-tag type="primary" style="margin-top: 10px" v-if="priceAfter!=priceBefore">可使用优惠</el-tag>
      </el-row>
      <el-row justify="center">
        <el-text style="margin-top: 10px;height: 20px" v-if="priceAfter!=priceBefore">预计到手：<span
            style="color: #f78989;font-size: 19px">{{priceAfter }}</span>&nbsp;￥
        </el-text>
      </el-row>
      <div style="height: 120px"></div>
      <el-row justify="center">
        <el-button type="primary" @click="toPay">点我去支付</el-button>
      </el-row>
      <el-row>
      </el-row>
      <el-row></el-row>

    </el-card>
  </transition>

  <el-dialog
      v-model="showRemoveConfirmDialog"
      width=30%
      @close="toRemoveName='';toRemoveId=0"
      style="border-radius: 6px"
  >
    <template #header>
      <el-text size="large">移除：{{ toRemoveName }}</el-text>
    </template>
    <template #footer>
      <el-button @click="showRemoveConfirmDialog=false">取消</el-button>
      <el-button @click="handleRemove" type="danger">从购物车移除</el-button>
    </template>

  </el-dialog>


</template>


<style scoped>
.main {
  position: absolute;
  right: 0;
  left: 0;
  top: 52px;
  bottom: 0;
  overflow-y: scroll;
}

.card {
  margin: 5px;
}

.float-card {
  position: fixed;
  right: 100px;
  bottom: 100px;
  min-width: 210px;
  max-width: 250px;
  border-radius: 9px
}


</style>
