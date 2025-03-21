<script setup lang="ts">
import {ref,computed} from 'vue';

import {uploadCouponInfo} from "../../api/coupon.ts";

const storeId = sessionStorage.getItem('userStoreId');
import "../../style/base.css"


let couponType = ref('FULL_REDUCTION');
let timeArray = ref();
let full = ref();
let reduction = ref();
let couponNum = ref();

const loading = ref(false);

//按钮的可用性
const createDisabled = computed(() => {
  console.log(111)
  if (couponType.value=='FULL_REDUCTION'){
    console.log(222)
    return !(hasFull.value && hasTimeArray.value && hasReduction.value && timeArray.value != null && full.value != null
        && reduction.value != null && couponNum.value != undefined && hasCoupon.value&&fullLogic.value&&couponNumLogic.value
    &&reductionLogic.value);
  }else {
    console.log(333)
    return !( hasTimeArray.value  && timeArray.value != null
        && couponNum.value != undefined && hasCoupon.value&&couponNumLogic.value);

  }
});


const isTimeArrayInput = computed(()=>{
  if (timeArray.value!=null)
  {
    return true;
  }
})
const isFullInput = computed(()=>{

  if (full.value!=null)
  {
    return true;
  }
})
const isReductionInput = computed(()=>{
  if (reduction.value!=null)
  {
    return true;
  }
})
const isCouponNumInput = computed(()=>{
  if (couponNum.value!=undefined)
  {
    return true;
  }

})
//是否为空
const hasTimeArray = computed(()=>timeArray.value!='')
const hasFull = computed(()=>full.value!='')
const hasReduction = computed(()=>reduction.value!='')
const hasCoupon = computed(()=>couponNum.value!='')
//判断合法规则
const numRule = /^[1-9]\d*$/
//判断合法性
const fullLogic = computed(()=>numRule.test(full.value))
const reductionLogic = computed(()=>numRule.test(reduction.value))
const couponNumLogic = computed(()=>numRule.test(couponNum.value))
// 清空缓存
function clearCache() {
  couponType.value = 'FULL_REDUCTION';
  timeArray.value = null;
  full.value = null;
  reduction.value = null;
  couponNum.value = undefined;
}

function handlePublish() {
  loading.value = true;
  handleCouponInfo();
}

function handleCouponInfo() {

  uploadCouponInfo({
    couponType: couponType.value,
    effectiveTime: timeArray.value[0],
    expiredTime: timeArray.value[1],
    full: full.value,
    reduction: reduction.value,
    storeId: Number(storeId),
  }, couponNum.value).then(res => {
    if (res.data.code == '000') {
      clearCache();
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
    loading.value = false;
  });
}

</script>


<template>
  <el-main>
    <el-row justify="center">
      <div class="staff-title">在这里为您的商店发布优惠券</div>
    </el-row>
    <el-row justify="center">
      <el-form style="width: 540px">
        <el-form-item label="优惠类型">
          <el-select id="identity"
                     v-model="couponType"
                     style="width: 100%;"
          >
            <el-option value="FULL_REDUCTION" label="满减券"/>
            <el-option value="SPECIAL" label="蓝鲸券"/>
          </el-select>
        </el-form-item>

        <el-form-item label="起止日期">
          <label v-if="!hasTimeArray&&isTimeArrayInput" for="time" class="error-warn">
            日期为空
          </label>
          <el-date-picker
              v-model="timeArray"
              type="daterange"
              range-separator="To"
              value-format="YYYY-MM-DD"
              start-placeholder="生效日期"
              end-placeholder="截至日期"
          />
        </el-form-item>

        <el-form-item label="消费达到" v-if="couponType=='FULL_REDUCTION'">
          <label v-if="!hasFull&&isFullInput" for="full" class="error-warn">
            金额为空
          </label>
          <label v-else-if="!fullLogic&&isFullInput" for="full" class="error-warn">
            金额不合法
          </label>
          <el-input v-model="full" class="input"
                    :class="{'error-warn-input' :(!hasFull&&isFullInput)||(
          !fullLogic&&isFullInput)}" placeholder="满多少 （单位：元）"
                    type="number"/>
        </el-form-item>
        <el-form-item label="折扣金额" v-if="couponType=='FULL_REDUCTION'">
          <label v-if="!hasReduction&&isReductionInput" for="time" class="error-warn">
            折扣金额为空
          </label>
          <label v-else-if="!reductionLogic&&isReductionInput" for="time" class="error-warn">
            折扣金额不合法
          </label>
          <el-input v-model="reduction" class="input" :class="{'error-warn-input' :(!hasReduction&&isReductionInput)||(

          !reductionLogic&&isReductionInput)}" placeholder="减多少 （单位：元）"
                    type="number"/>
        </el-form-item>
        <el-form-item label="优惠券数">
          <label v-if="!hasCoupon&&isCouponNumInput" for="couponNum" class="error-warn">
            优惠券数为空
          </label>
          <label v-else-if="!couponNumLogic&&isCouponNumInput" for="couponNum" class="error-warn">
            优惠券数不合法
          </label>

          <el-input v-model="couponNum" class="input" :class="{'error-warn-input' :(!hasCoupon&&isCouponNumInput)||(

          !couponNumLogic&&isCouponNumInput)}" placeholder="发多少张"
                    type="number"/>
        </el-form-item>
        <el-row justify="center">
          <el-col :span="3"/>
          <el-col :span="5">
            <el-button type="primary" @click="handlePublish" :disabled="createDisabled" :loading="loading"
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
