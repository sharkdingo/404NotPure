<!--Lab2新增-创建商店界面-->
<script setup lang="ts">
import {ref, computed} from 'vue';
import {uploadImage} from '../../api/tools';
import {uploadStoreInfo} from '../../api/store.ts';

import {UploadFilled} from "@element-plus/icons-vue";
import "../../style/base.css";

//按钮是否可用
const createDisabled = computed(() => {
  return !(hasIntro.value && hasAddress.value && hasName.value && storeIntro.value != null && storeName.value != null
      && storeAddress.value != null);
});
const isInput = computed(() => {
  if (hasName.value || hasAddress.value || hasIntro.value) {
    return true;
  }
});
//判断是否为空
const hasAddress = computed(() => storeAddress.value != '');
const hasName = computed(() => storeName.value != '');
const hasIntro = computed(() => storeIntro.value != '');

// v-model 绑定file-list
const imageFileList = ref([] as any);

// 存返回的imgUrl
const imgURLs = ref([] as any);

let storeName = ref();
let storeIntro = ref();
let storeAddress = ref();

const loading = ref(false);

// 异步上传
async function handleChangeUltimate() {
  loading.value = true;
  await loopUpload();
  handleStoreInfo();
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

// 成功时调用
function clearCache() {
  imgURLs.value = [];
  imageFileList.value = [];
  storeName.value = null;
  storeIntro.value = null;
  storeAddress.value = null;
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 1 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest();
}

function handleStoreInfo() {
  uploadStoreInfo({
    address: storeAddress.value,
    storeName: storeName.value,
    imgURL: imgURLs.value[0],
    description: storeIntro.value,
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
      <div class="title">在这里创建新商店</div>
    </el-row>
    <el-row justify="center">
      <el-form style="width: 540px">
        <el-form-item label="商店Logo">
          <el-upload
              v-model:file-list="imageFileList"
              :limit="1"
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
              将文件拖到此处或单击此处上传。仅允许上传一份文件。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="商店名称">
          <label v-if="!hasName&&isInput" for="name" class="error-warn">
            商店名为空
          </label>
          <el-input v-model="storeName" class="input" :class="{'error-warn-input' :!hasName&&isInput}"
                    placeholder="给商店取个好听的名字" clearable/>
        </el-form-item>
        <el-form-item label="商店地址">
          <label v-if="!hasAddress&&isInput" for="address" class="error-warn">
            商店地址为空
          </label>
          <el-input v-model="storeAddress" class="input" :class="{'error-warn-input' :!hasAddress&&isInput}"
                    placeholder="在这里写下商店地址"
                    type="textarea" :rows="2" resize="none"/>
        </el-form-item>
        <el-form-item label="商店简介">
          <label v-if="!hasIntro&&isInput" for="intro" class="error-warn">
            商店简介为空
          </label>
          <el-input v-model="storeIntro" class="input" :class="{'error-warn-input' :!hasIntro&&isInput}"
                    placeholder="在这里写下商店简介"
                    type="textarea" :rows="5" resize="none"/>
        </el-form-item>

        <el-row justify="center">
          <el-col :span="3"/>
          <el-col :span="5">
            <el-button type="primary" @click="handleChangeUltimate" :disabled="createDisabled" :loading="loading"
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

.title {
  margin-top: 10px;
  margin-bottom: 40px;
  font-size: large;
  color: mediumpurple;
}

.error-warn {
  color: #f89898;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}
</style>
