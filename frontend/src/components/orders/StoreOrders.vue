<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {type OrderItemsInfo, orderItemPageInfo, orderItemSend} from '../../api/order-item.ts';


const orderList = ref([] as OrderItemsInfo);
const currentPage = ref(1 as number);
const pageSize = ref(5 as number);
const totalItems = ref(0 as number);


function loadOrders(page: number) {
  orderItemPageInfo(page - 1, pageSize.value).then(res => {
    totalItems.value = res.data.result.totalElements;
    orderList.value = res.data.result.content;
  });
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadOrders(page);
}

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to the first page
  loadOrders(currentPage.value);
}

onMounted(() => {
  loadOrders(currentPage.value);
});

function handleSend(orderSerialNumber: string) {
  orderItemSend(orderSerialNumber).then(res => {
    if (res.data.code == '000') {
      ElMessage({
        message: "发货成功",
        type: 'success',
        center: true,
      });
      loadOrders(currentPage.value);
    } else {
      ElMessage({
        message: "发货失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
  });
}

function parseState(stateStr: string): string {
  if (stateStr == 'UNPAID') {
    return '已下单&未支付';
  } else if (stateStr == 'UNSEND') {
    return '已支付&未发货';
  } else if (stateStr == 'UNGET') {
    return '已发货&未签收';
  } else if (stateStr == 'UNCOMMENT') {
    return '已签收&未评价';
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
      <div class="staff-title">在这里查看您的商店收到的订单</div>
    </el-row>
    <div v-for="order in orderList">
      <el-row justify="center">
        <el-card class="common-card" shadow="never">
          <template #header>
            <el-row>
              <el-col :span="21">
                <el-text size="large">{{ order.productName }}</el-text>
                <el-text>&nbsp;*{{ order.productNumber }}</el-text>
              </el-col>
              <el-col :span="3" style="text-align: center">
                <el-button type="primary" v-if="order.state=='UNSEND'" @click="handleSend(order.orderSerialNumber)">发货
                </el-button>
                <el-text v-else-if="order.state=='UNGET'||order.state=='UNCOMMENT'">已发货
                </el-text>
                <el-text v-else-if="order.state=='UNPAID'">不可发货
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
                <el-text>订单金额：{{ order.totalAfter }}￥</el-text>&nbsp;&nbsp;
                <el-text tag="del" size="small" v-if="order.totalAfter!=order.total">{{ order.total }}￥</el-text>
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

</template>


<style scoped>

</style>
