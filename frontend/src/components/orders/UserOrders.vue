<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {type OrderItemsInfo, orderItemPageInfo, orderItemGet} from '../../api/order-item.ts';
import {uploadComment} from "../../api/comment.ts";
import "../../style/base.css";
import ConfirmDialog from "../pay/PayConfirmDialog.vue";
import {getMultiOrder} from "../../api/order.ts";


const orderList = ref([] as OrderItemsInfo);
const currentPage = ref(1 as number);
const pageSize = ref(5 as number);
const totalItems = ref(0 as number);

let showCommentInput = ref(false);
let selectedOrderSerial = ref("");
let selectedProductId = ref();

const comment = ref("");
const rate = ref(0);

const showDuringPay = ref(false);

function loadOrders() {
  orderItemPageInfo(currentPage.value - 1, pageSize.value).then(res => {
    totalItems.value = res.data.result.totalElements;
    orderList.value = res.data.result.content;
  });
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadOrders();
}

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to the first page
  loadOrders();
}

onMounted(() => {
  loadOrders();
});

function handleToGet(orderSerialNumber: string) {
  orderItemGet(orderSerialNumber).then(res => {
    if (res.data.code == '000') {
      ElMessage({
        message: "确认收货成功",
        type: 'success',
        center: true,
      });
      loadOrders();
    } else {
      ElMessage({
        message: "确认收货失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
  });
}

const confirmDialog = ref();


function handleToPay(orderSerialNumber: string) {

  getMultiOrder(orderSerialNumber).then(res => {
    confirmDialog.value.callDialog(res.data.result);
  });

}

function handlePayComplete() {
  loadOrders();
  showDuringPay.value = false;
}

function handleToCommentButton(orderSerialNumber: string, productId: number) {
  showCommentInput.value = true;
  selectedOrderSerial.value = orderSerialNumber;
  selectedProductId.value = productId;
}

function handleDialogClose() {
  showCommentInput.value = false;
  selectedOrderSerial.value = "";
  clearCommentCache();
}

function clearCommentCache() {
  comment.value = "";
  rate.value = 0;
}


function handleDialogConfirm() {
  if (rate.value < 1) {
    ElMessage({
      message: "请别忘记为商品打分",
      type: 'warning',
      center: true,
    });
    return;
  } else if (comment.value === "") {
    ElMessage({
      message: "请别忘记留下评论",
      type: 'warning',
      center: true,
    });
    return;
  }
  uploadComment({
    productId: selectedProductId.value,
    content: comment.value,
    orderSerialNumber: selectedOrderSerial.value,
    grade: rate.value
  }).then(res => {
    if (res.data.code == '000') {
      handleDialogClose();
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

function parseState(stateStr: string): string {
  if (stateStr == 'UNPAID') {
    return '已下单，等待支付';
  } else if (stateStr == 'UNSEND') {
    return '已支付，等待发货';
  } else if (stateStr == 'UNGET') {
    return '已发货，等待签收';
  } else if (stateStr == 'UNCOMMENT') {
    return '已签收，等待您的评价';
  } else if (stateStr == 'DONE') {
    return '订单已完成';
  } else if (stateStr == 'CANCEL') {
    return '订单已取消';
  }
  return 'parse state failed:' + stateStr;
}

</script>

<template>
  <el-main class="main-without-aside">
    <el-row justify="center">
      <div class="customer-title">在这里查看您下的订单</div>
    </el-row>
    <div v-for="order in orderList">
      <el-row justify="center">
        <el-card class="common-card" shadow="never">
          <template #header>
            <el-row align="middle">
              <el-col :span="16">
                <el-text size="large">{{ order.productName }}</el-text>
                <el-text>&nbsp;*{{ order.productNumber }}</el-text>
              </el-col>
              <el-col :span="8" style="text-align: end">
                <el-button type="primary" v-if="order.state=='UNCOMMENT'"
                           @click="handleToCommentButton(order.orderSerialNumber,order.productId)">评论
                </el-button>
                <el-button type="primary" v-else-if="order.state=='UNGET'"
                           @click="handleToGet(order.orderSerialNumber)">签收
                </el-button>
                <!--                <el-button type="danger" v-else-if="order.state=='UNPAID'"-->
                <!--                           @click="console.log(order.orderSerialNumber)">取消-->
                <!--                </el-button>-->
                <el-button type="primary" v-else-if="order.state=='UNPAID'"
                           @click="handleToPay(order.orderSerialNumber)">支付
                </el-button>
                <el-text v-else-if="order.state=='UNSEND'">待发货
                </el-text>
                <el-text style="color: #13ce66" v-else-if="order.state=='DONE'">已完成
                </el-text>
                <el-text style="color: indianred" v-else-if="order.state=='CANCEL'">已取消
                </el-text>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="6">
              <el-image style="width: 100px; height: 100px;border-radius: 6px" :src="order.imgURL" :fit="'cover'"/>
            </el-col>
            <el-col :span="16">
              <el-row>
                <el-text>订单状态：{{ parseState(order.state) }}</el-text>
              </el-row>
              <el-row>
                <el-text>订单编号：{{ order.orderSerialNumber }}</el-text>
              </el-row>
              <el-row>
                <el-text>下单时间：{{ order.createTime }}</el-text>
              </el-row>
              <el-row>
                <el-text>订单金额：</el-text>
                <el-text tag="del" v-if="order.totalAfter!=order.total" style="margin-right: 3px">
                  {{ order.total }}￥
                </el-text>
                <el-text>{{ order.totalAfter }}￥</el-text>
                <el-text v-if="order.totalAfter!=order.total">
                  <el-tag type="warning" size="small" class="bind-reminder-tag" v-if="order.bind">捆绑折扣</el-tag>
                  <el-tag type="primary" size="small" class="bind-reminder-tag" v-else>
                    折扣
                  </el-tag>

                </el-text>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </div>
    <el-row justify="center">
      <div>
        <el-pagination
            layout="prev, pager, next"
            :page-count="Math.ceil(totalItems / pageSize)"
            :current-page="currentPage"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
        />
      </div>
    </el-row>
  </el-main>


  <el-dialog
      v-model="showCommentInput"
      title="分享您对商品的评价"
      width=40%
      :before-close="handleDialogClose"
      :close-on-click-modal="false"
  >
    <div style="text-align: center">
      <el-rate v-model="rate"/>
    </div>
    <br>
    <el-input v-model="comment" class="input" placeholder="在这里写下您的评价"
              type="textarea" :rows="3" resize="none"/>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="handleDialogConfirm">
          确认评价
        </el-button>
      </div>
    </template>
  </el-dialog>


  <ConfirmDialog ref="confirmDialog" @complete="handlePayComplete"></ConfirmDialog>

</template>


<style scoped>
.bind-reminder-tag {
  margin-left: 10px;
}
</style>
