<!--Lab2新增-创建商品界面-->
<script setup lang="ts">
import {ref, computed} from 'vue';
import {uploadImage} from '../../api/tools';

import {UploadFilled} from "@element-plus/icons-vue";
import {uploadProductInfo} from "../../api/product.ts";
import "../../style/base.css";

// 创建商品按钮可用性
const createDisabled = computed(() => {
  return !(priceLogic.value && numberLogic.value && hasProductName.value &&
      hasProductIntro.value && hasProductType.value && hasProductNumber.value
      && hasProductPrice.value && isPrice && isNumber && productType.value != null
      && productIntro.value != null && productName.value != null);
});
//是否文本框为空

const hasProductName = computed(() => productName.value != '');
const isNumber = computed(() => number.value != null);
const hasProductIntro = computed(() => productIntro.value != '');
const hasProductType = computed(() => productType.value != '');
const hasProductNumber = computed(() => number.value != '');
const hasProductPrice = computed(() => price.value != '');
const isPrice = computed(() => price.value != null);
//设置规则
const productPrice = /^\d+(\.\d{1,2})?$/;
const productNumber = /^\d+$/;


//设置逻辑
const priceLogic = computed(() => productPrice.test(price.value));
const numberLogic = computed(() => productNumber.test(number.value));


const storeId = sessionStorage.getItem('userStoreId');

// v-model 绑定file-list
const imageFileList = ref([] as any);

// 存返回的imgUrl
const imgURLs = ref([] as any);

let productName = ref();
let productIntro = ref();
let productType = ref();
let number = ref();
let price = ref();

const loading = ref(false);

// 异步上传
async function handleChangeUltimate() {
  loading.value = true;
  await loopUpload();
  handleProductInfo();
}

async function loopUpload() {
  for (let image of imageFileList.value) {
    let formData = new FormData();
    formData.append('file', image.raw);
    const res = await uploadImage(formData);
    imgURLs.value.push(res.data.result as string);
  }
}

// 在上传失败时，因为上传图片并保存url先于上传执行，将已经保存的url作废
function resetImgCache() {
  imgURLs.value = [];
}

// 清空缓存
function clearCache() {
  imgURLs.value = [];
  imageFileList.value = [];
  productName.value = null;
  productIntro.value = null;
  productType.value = null;
  price.value = null;
  number.value = null;
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 5 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest();
}


function handleProductInfo() {
  uploadProductInfo({
    productName: productName.value,
    imgURLs: imgURLs.value,
    description: productIntro.value,
    productType: productType.value,
    storeId: Number(storeId),
    price: price.value,
    number: number.value,
  }).then(res => {
    if (res.data.code == '000') {
      clearCache();
      ElMessage({
        message: "已提交，请勿重复提交",
        type: 'success',
        center: true,
      });
    } else {
      resetImgCache();
      ElMessage({
        message: "提交失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
    loading.value = false;
  });
}
</script>


<template>
  <el-main class="main-without-aside">
    <el-row justify="center">
      <div class="staff-title">在这里为您的商店创建商品</div>
    </el-row>
    <el-row justify="center">
      <el-form style="width: 540px">
        <el-form-item label="商品图片">

          <el-upload
              v-model:file-list="imageFileList"
              :limit="5"
              :on-exceed="handleExceed"
              class="upload-demo input"
              list-type="picture"
              :http-request="uploadHttpRequest"
              drag
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处或单击此处上传，最多允许上传5份文件。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品名称">

          <label v-if="!hasProductName" for="name" class="error-warn">
            商品名称为空

          </label>
          <el-input v-model="productName" :class="{'error-warn-input' :!hasProductName}" class="input"
                    placeholder="商品名" clearable/>
        </el-form-item>

        <el-form-item label="商品价格">
          <label v-if="!hasProductPrice" for="price" class="error-warn">
            价格为空
          </label>
          <label v-else-if="!isPrice" for="price">
          </label>
          <label v-else-if="!priceLogic" for="price" class="error-warn">
            价格格式不合法
          </label>
          <el-input v-model="price" class="input"
                    :class="{'error-warn-input' :!hasProductPrice||(!priceLogic&&hasProductPrice&&isPrice)}"
                    placeholder="多少钱？单位：元"
                    type="textarea" :rows="1" resize="none"/>
        </el-form-item>

        <el-form-item label="商品类型">

          <el-select id="ProductType" v-model="productType" placeholder="请选择">
            <el-option value="FOOD" label="食物"/>
            <el-option value="CLOTHES" label="衣物"/>
            <el-option value="FURNITURE" label="家具"/>
            <el-option value="ELECTRONICS" label="电子产品"/>
            <el-option value="ENTERTAINMENT" label="娱乐"/>
            <el-option value="SPORTS" label="运动"/>
            <el-option value="LUXURY" label="奢侈品"/>
          </el-select>
          <!--          <el-input v-model="productType" class="input" placeholder="FOOD"-->
          <!--                    type="textarea" :rows="1" resize="none"/>-->
        </el-form-item>
        <el-form-item label="库存数量">
          <label v-if="!hasProductNumber" for="number" class="error-warn">
            数量为空
          </label>
          <label v-else-if="!isNumber" for="number">
          </label>
          <label v-else-if="!numberLogic" for="number" class="error-warn">
            数量格式不合法
          </label>
          <el-input v-model="number" class="input"
                    :class="{'error-warn-input' :!hasProductNumber||(!numberLogic&&isNumber&&hasProductNumber)}"
                    placeholder="现有库存数"
                    type="textarea" :rows="1" resize="none"/>
        </el-form-item>
        <el-form-item label="商品简介">
          <label v-if="!hasProductIntro" for="price" class="error-warn">
            商品简介为空
          </label>
          <el-input v-model="productIntro" class="input" :class="{'error-warn-input' :!hasProductIntro}"
                    placeholder="在这里写下商品简介"
                    type="textarea" :rows="5" resize="none"/>
        </el-form-item>

        <el-row justify="center">
          <el-col :span="3"/>
          <el-col :span="5">

            <el-button type="primary" @click="handleChangeUltimate" :disabled=createDisabled :loading="loading"
            >点击创建
            </el-button>
          </el-col>
        </el-row>


      </el-form>
    </el-row>
  </el-main>
</template>


<style scoped>
.input {
  width: 500px;
}

.error-warn {
  color: #f89898;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}
</style>
