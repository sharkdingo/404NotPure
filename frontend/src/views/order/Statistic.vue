<script setup lang="ts">
import {onMounted, ref} from "vue";

const role = sessionStorage.getItem("role");
import {Warning, CaretTop, ArrowRight, CaretBottom, PieChart} from "@element-plus/icons-vue";
import "../../style/base.css";
import {useTransition} from '@vueuse/core';
import {router} from "../../router";
import {getTable, statisticChartInfo, statisticInfo} from "../../api/statistic.ts";

const totalTurnoverCnt = ref(0);
const totalOrderCnt = ref(0);
const totalCustomerCnt = ref(0);
const monthTurnoverCnt = ref(0);
const monthOrderCnt = ref(0);
const monthCustomerCnt = ref(0);

const turnoverCntOutput = useTransition(totalTurnoverCnt, {
  duration: 1000,
});
const orderCntOutput = useTransition(totalOrderCnt, {
  duration: 1000,
});
const customerCntOutput = useTransition(totalCustomerCnt, {
  duration: 1000,
});
const monthTurnoverCntOutput = useTransition(monthTurnoverCnt, {
  duration: 1000,
});
const monthOrderCntOutput = useTransition(monthOrderCnt, {
  duration: 1000,
});
const monthCustomerCntOutput = useTransition(monthCustomerCnt, {
  duration: 1000,
});

const monthTurnoverRate = ref<number>(0);
const monthOrderRate = ref<number>(0);
const monthCustomerRate = ref<number>(0);

function downloadHandler(data: any, fileName: string, type: string) {
  const blob = new Blob([data], {type: type || 'application/octet-stream'});
  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = fileName;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}

function handleTableExport() {
  loading.value = true;
  let url: string;
  getTable().then(res => {
    url = URL.createObjectURL(new Blob([res.data], {type: "application/vnd.ms-excel"}));
    fetch(url).then(res => {
      return res.blob();
    })
        .then(blob => {
          downloadHandler(blob, 'export.xlsx', 'application/vnd.ms-excel');
          loading.value = false;
        })
        .catch(error => {
          console.error('文件下载失败：', error);
        });
  });
}


onMounted(() => {
  statisticInfo().then(res => {
    totalTurnoverCnt.value = res.data.result.allTurnover;
    totalOrderCnt.value = res.data.result.allOrderNum;
    totalCustomerCnt.value = res.data.result.allUserNum;
    monthTurnoverCnt.value = res.data.result.monthTurnover;
    monthOrderCnt.value = res.data.result.monthOrderNum;
    monthCustomerCnt.value = res.data.result.monthUserNum;

    monthTurnoverRate.value = res.data.result.turnoverRate;
    monthOrderRate.value = res.data.result.orderRate;
    monthCustomerRate.value = res.data.result.userRate;
  });

  statisticChartInfo().then(res => {
    turnOverDataArray.value = res.data.result.turnoverEveryMonth;
    orderCntDataArray.value = res.data.result.orderNumEveryMonth;
    customerCntDataArray.value = res.data.result.userNumEveryMonth;
    monthDataArray.value = res.data.result.months;
    option1 = ref(data1);
    option2 = ref(data2);
    option3 = ref(data3);
  });
});

const loading = ref(false);


// table

const turnOverDataArray = ref([0, 0, 0, 0, 0]);
const orderCntDataArray = ref([0, 0, 0, 0, 0]);
const customerCntDataArray = ref([0, 0, 0, 0, 0]);
const monthDataArray = ref(['-', '-', '-', '-', '-']);

const c1 = ref();
const c2 = ref();
const c3 = ref();

import {use} from "echarts/core";
import {GridComponent} from 'echarts/components';
import {CanvasRenderer} from "echarts/renderers";
import {LineChart} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from "echarts/components";
import VChart, {THEME_KEY} from "vue-echarts";
import {provide} from "vue";

use([
  GridComponent,
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

provide(THEME_KEY, "light");

const data1 = {
  title: {
    text: "流水趋势",
    left: "center"
  },
  xAxis: {
    name: '时间',
    data: monthDataArray
  },
  yAxis: {
    type: 'value',
    name: '流水/元'
  },
  series: [
    {
      data: turnOverDataArray,
      type: 'line',
      smooth: true
    }
  ]
};

const data2 = {
  title: {
    text: "订单趋势",
    left: "center"
  },
  xAxis: {
    name: '时间',
    data: monthDataArray
  },
  yAxis: {
    type: 'value',
    name: '订单数/单'
  },
  series: [
    {
      data: orderCntDataArray,
      type: 'line',
      smooth: true
    }
  ]
};

const data3 = {
  title: {
    text: "用户趋势",
    left: "center"
  },
  xAxis: {
    name: '时间',
    data: monthDataArray
  },
  yAxis: {
    type: 'value',
    name: '用户数/人'
  },
  series: [
    {
      data: customerCntDataArray,
      type: 'line',
      smooth: true
    }
  ]
};

let option1 = ref(data1);
let option2 = ref(data2);
let option3 = ref(data3);
</script>

<template>
  <el-main class="main-without-aside" id="main">
    <el-row justify="center" v-if="role=='CEO'">
      <div class="admin-title">在这里查看商场报表</div>
    </el-row>
    <el-row justify="center" v-if="role=='STAFF'">
      <div class="staff-title">在这里查看您商店的报表</div>
    </el-row>

    <el-row justify="center">
      <div style="width: 70%">
        <el-row :gutter="6" justify="center">
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="turnoverCntOutput">
                <template #title>
                  <div class="statistic-title-div">
                    <span v-if="role=='CEO'">累计平台流水</span>
                    <span v-if="role=='STAFF'">累计商店流水</span>
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内所有商店流水之和"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店的累计流水"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">元</el-text>
                </template>
              </el-statistic>
              <div style="height: 25px"/>
              <el-statistic :value="monthTurnoverCntOutput">
                <template #title>
                  <div class="statistic-title-div">
                    <span v-if="role=='CEO'">上月平台流水</span>
                    <span v-if="role=='STAFF'">上月商店流水</span>
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内上一个月所有商店流水之和"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店上一个月的总流水"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">元</el-text>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <span>环比趋势</span>
                <span style="color: #13ce66" v-if="monthTurnoverRate>=0">
              {{ monthTurnoverRate }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                <span style="color: indianred" v-else>
              {{ monthTurnoverRate }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="orderCntOutput">
                <template #title>
                  <div class="statistic-title-div">
                    累计订单数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内累计交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店累计交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">单</el-text>
                </template>
              </el-statistic>
              <div style="height: 25px"/>
              <el-statistic :value="monthOrderCntOutput">
                <template #title>
                  <div class="statistic-title-div">
                    上月订单数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内上月交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店上月交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">单</el-text>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <span>环比趋势</span>
                <span style="color: #13ce66" v-if="monthOrderRate>=0">
              {{ monthOrderRate }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                <span style="color: indianred" v-else>
              {{ monthOrderRate }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="customerCntOutput">
                <template #title>
                  <div class="statistic-title-div">
                    累计顾客数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内累计完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店累计完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">人</el-text>
                </template>
              </el-statistic>
              <div style="height: 25px"/>
              <el-statistic :value="monthCustomerCntOutput">
                <template #title>
                  <div class="statistic-title-div">
                    上月顾客数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内上个月完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店上个月完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">人</el-text>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <span>环比趋势</span>
                <span style="color: #13ce66" v-if="monthCustomerRate>=0">
              {{ monthCustomerRate }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                <span style="color: indianred" v-else>
              {{ monthCustomerRate }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-row>

    <el-row style="height: 50px"></el-row>
    <el-row justify="center">
      <el-card class="export-card" shadow="never">
        <el-row>
          <el-col :span="12">
            <div>
              <el-text>订单详情</el-text>
              <el-button link size="small" type="primary" @click="router.push('/orders')">
                全部订单
                <el-icon>
                  <ArrowRight/>
                </el-icon>
              </el-button>
            </div>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6" style="text-align: right">
            <el-button type="primary" size="small" @click="handleTableExport" :loading="loading">导出订单报表
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row justify="center">
      <el-divider class="divider">
        <el-text size="large" style="color: dodgerblue">
          <el-icon>
            <PieChart/>
          </el-icon>
          详细
        </el-text>
      </el-divider>
    </el-row>

    <el-row justify="center">
      <div class="table-card">
        <v-chart ref="c1" class="chart" autoresize :option="option1"/>
      </div>
      <div class="table-card">
        <v-chart ref="c2" class="chart" autoresize :option="option2"/>
      </div>
      <div class="table-card">
        <v-chart ref="c3" class="chart" autoresize :option="option3"/>
      </div>


    </el-row>

  </el-main>

  <el-backtop style="position: fixed; right: 50px;bottom: 160px" :visibility-height="100" target="#main"/>
</template>

<style scoped>

.statistic-card {
  height: 160px;
  padding: 20px;
  margin: 6px;
  border-radius: 10px;
  background-color: aliceblue;
  min-width: 130px;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 6px;
}

.export-card {
  width: 60%;
  border-radius: 6px;
  margin: 5px;
}

.table-card {
  width: 60%;
  border-radius: 6px;
  margin: 30px;
}

.chart {
  height: 400px;
  width: 100%;
  margin: 10px;
}

.divider {
  margin-top: 120px;
  margin-bottom: 30px;
  width: 90%;
}

.statistic-title-div {
  display: inline-flex;
  align-items: center
}

</style>