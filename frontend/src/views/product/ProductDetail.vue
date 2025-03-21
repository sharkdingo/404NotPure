<!--Lab2新增-商品详情界面-->
<script setup lang="ts">

import {onMounted, ref} from "vue";
import {ProductInfo, productInfoDetail, uploadProductNumUpdate} from "../../api/product.ts";
import {router} from "../../router";
import {useRoute} from "vue-router";
import {ArrowLeft, ChatLineSquare, ShoppingCart} from "@element-plus/icons-vue";
import {parseTime} from "../../utils";

import PayDialog from "../../components/pay/PayDialogPlus.vue";
import {add2ShoppingCart} from "../../api/shopping-cart.ts";

import "../../style/base.css";


const productDetail = ref({} as ProductInfo);
const grade = ref();

const role = sessionStorage.getItem("role");
const storeId = (Number)(sessionStorage.getItem('userStoreId'));

let newNumber = ref();
let showNumUpdateInput = ref(false);


let buyNum = ref(1);

let productPrice = ref();

const payDialog = ref();


onMounted(() => {
  const productId = Number(useRoute().params.productId);
  loadProductInfo(productId);

});

function loadProductInfo(x: number) {
  productInfoDetail(x).then(res => {
    productDetail.value = res.data.result;
    newNumber.value = productDetail.value.number;
    productPrice.value = productDetail.value.price;
    grade.value = Number(productDetail.value.grade);
  });
}

function handleNumDialogCancel() {
  showNumUpdateInput.value = false;
}

function handleNumDialogConfirm() {
  uploadProductNumUpdate({
    productId: productDetail.value.productId,
    number: newNumber.value
  }).then(res => {
    if (res.data.code == '000') {
      showNumUpdateInput.value = false;
      ElMessage({
        message: "已提交，请勿重复提交",
        type: 'success',
        center: true,
      });
    } else {
      ElMessage({
        message: "提交失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
  });
}


function handlePayImmediately() {
  payDialog.value.callPayDialog({
    products: [
      {productId: productDetail.value.productId, num: buyNum, storeId: productDetail.value.storeId},
    ]
  });
}

function handlePaymentFinish() {
  // ElMessage({
  //   message: "支付成功！",
  //   type: 'success',
  //   center: true,
  // });
  console.log('finish');
}

function handleAdd2Cart() {
  add2ShoppingCart(productDetail.value.productId).then((res) => {
    if (res.data.code == '000') {
      ElMessage({
        message: "已成功添加",
        type: 'success',
        center: true,
      });
    } else if (res.data.code == '400') {
      ElMessage({
        message: res.data.msg,
        type: 'warning',
        center: true,
      });
    }
  });
}

</script>

<template>
  <el-container>
    <!--商品详情的一部分内容放在侧边栏里-->
    <el-aside width="25%" class="page-aside">

      <el-row justify="center" align="middle" style="margin-top: 10px;margin-bottom: 20px">
        <el-col :span="1"></el-col>
        <el-col :span="3" style="text-align: center">
          <el-button circle @click="router.push('/storeDetail/'+productDetail.storeId)">
            <el-icon :size="20">
              <ArrowLeft/>
            </el-icon>
          </el-button>
        </el-col>

        <el-col :span="17" style="text-align: center">
          <el-text style="font-size: 17px;color: cornflowerblue;">{{ productDetail.productName }}</el-text>
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
      <el-row>
        <el-col :span="24">
          <div class="description">
            <el-text>{{ productDetail.description }}</el-text>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-text class="number">剩余库存：{{ productDetail.number }}件</el-text>
        </el-col>

        <el-col :span="8" v-if="role==='STAFF'&&storeId===productDetail.storeId">
          <el-button type="primary" size="small" @click="showNumUpdateInput=true">修改库存数
          </el-button>
        </el-col>
      </el-row>
      <el-row style="height: 40%"></el-row>

      <el-row justify="center" style="margin: 10px">
        <el-text class="price-text">{{ productDetail.price }} ¥
        </el-text>
      </el-row>
      <el-row justify="center" style="margin-top: 20px">

      </el-row>

      <el-row justify="center" style="margin: 10px" v-if="role=='CUSTOMER'">
        <el-input-number v-model="buyNum" :min="1" :max="100" size="small" style="width: 90px"/>
        <div style="display: flex;width: 16px"></div>
        <el-button type="primary" @click="handlePayImmediately" style="width: 90px">立即购买
        </el-button>
        <el-button type="primary" @click="handleAdd2Cart" color="#85ce61" style="color: white">+
          <el-icon :size="16">
            <ShoppingCart/>
          </el-icon>
        </el-button>
      </el-row>


    </el-aside>

    <el-main class="page-main">
      <el-row justify="center">
        <el-col :span="24" v-for="url in productDetail.imgURLs" style="text-align: center">
          <el-image :src="url" alt="" :fit="'cover'" class="img radius0"/>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-divider style="margin-top: 90px;margin-bottom: 30px">
          <el-text class="comment-title-text" size="large">
            <el-icon>
              <ChatLineSquare/>
            </el-icon>
            评论
          </el-text>
        </el-divider>
      </el-row>

      <div v-for="comment in productDetail.productComments" class="comment-box radius0">
        <el-row justify="center">
          <el-text>{{ comment.userName }}&nbsp;&nbsp;&nbsp;&nbsp;{{ parseTime(comment.createTime) }}&nbsp;&nbsp;&nbsp;&nbsp;{{
              comment.grade
            }}⭐
          </el-text>
        </el-row>
        <el-row justify="center">
          <el-text line-clamp="3" style="max-width: 70%">
            {{ comment.content }}
          </el-text>
        </el-row>
      </div>

      <el-backtop style="position: fixed; right: 30px;bottom: 160px" :visibility-height="100" target=".page-main"/>
    </el-main>
  </el-container>
  <el-dialog
      v-model="showNumUpdateInput"
      title="修改商品库存数"
      width="500"
      style="border-radius: 9px"
  >
    <el-row justify="center">
      <el-input v-model="newNumber" style="width: 70%"
                type="number"/>
    </el-row>
    <div style="height: 20px"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleNumDialogCancel">取消</el-button>
        <el-button type="primary" @click="handleNumDialogConfirm">
          确认更改
        </el-button>
      </div>
    </template>
  </el-dialog>


  <PayDialog v-if="role=='CUSTOMER'" ref="payDialog" @payment-finish="handlePaymentFinish()"></PayDialog>
</template>


<style scoped>

.grade-stars {
  margin-top: 1px;
  margin-bottom: 30px;
}

.comment-box {
  width: 70%;
  text-align: center;
  margin: 12px auto;
  padding: 6px;
  background-color: aliceblue;
}

.comment-title-text {
  color: dodgerblue;
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


.description {
  margin: 20px;
}

.number {
  margin: 20px;
  color: darksalmon;
}

.img {
  height: 500px;
  width: 600px;
  margin: 20px;
}

.price-text {
  font-size: x-large;
  font-family: fantasy;
}
</style>
