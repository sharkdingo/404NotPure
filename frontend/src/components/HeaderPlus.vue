<script setup lang="ts">
import {router} from '../router';
// import {parseRole} from "../utils";
import {
  User,
  SwitchButton,
  Edit,
  Tickets,
  Menu,
  Present,
  Wallet,
  Search,
  DataLine,
  ShoppingCart
} from "@element-plus/icons-vue";

const role = sessionStorage.getItem('role');    //登录的时候插入的


//退出登录
function logout() {
  ElMessageBox.confirm(
      '是否要退出登录？',
      '提示',
      {
        customClass: "customDialog",
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: "warning",
        showClose: false,
        roundButton: true,
        center: true
      }
  ).then(() => {
    sessionStorage.setItem('token', '');
    router.push({path: "/login"});
  });
}

</script>


<template>
  <el-header class="header">
    <el-menu
        :default-active="$route.path"
        class="el-menu"
        mode="horizontal"
        router
        :ellipsis-icon="Menu"
        :ellipsis="false"
    >
      <el-menu-item index="/homePage">
        <img
            class="bw-icon"
            src="/src/assets/blueWhale.svg"
            alt="Element logo"
        />&nbsp;&nbsp; 首页&nbsp;
      </el-menu-item>

      <el-menu-item index="/search">
        <el-icon :size="20">
          <Search/>
        </el-icon>
        搜索
      </el-menu-item>
      <el-menu-item v-if="role=='CUSTOMER'" index="/coupons">
        <el-icon :size="20">
          <Present/>
        </el-icon>
        优惠
      </el-menu-item>

      <div class="flex-grow"/>

      <el-menu-item v-if="role=='STAFF'||role=='CEO'" index="/statistic">
        <el-icon :size="20">
          <DataLine/>
        </el-icon>
        报表
      </el-menu-item>
      <el-sub-menu v-if="role=='MANAGER'||role=='STAFF'||role=='CEO'" index="">
        <template #title>
          <el-icon :size="20">
            <Edit/>
          </el-icon>
          管理
        </template>
        <el-menu-item v-if="role=='MANAGER'" index="/createStore">创建商店</el-menu-item>
        <el-menu-item v-if="role=='STAFF'" index="/createProduct">创建商品</el-menu-item>
        <el-menu-item v-if="role=='STAFF'||role=='CEO'" index="/publishCoupon">发布优惠券
        </el-menu-item>
        <el-menu-item v-if="role=='STAFF'||role=='CEO'" index="/coupons">管理优惠券</el-menu-item>
      </el-sub-menu>

      <el-menu-item v-if="role=='CUSTOMER'" index="/shoppingCart">
        <el-icon :size="21">
          <ShoppingCart/>
        </el-icon>
        购物车
      </el-menu-item>
      <el-menu-item v-if="role=='CUSTOMER'" index="/myCoupons">
        <el-icon :size="20">
          <Wallet/>
        </el-icon>
        券包
      </el-menu-item>

      <el-menu-item index="/orders">
        <el-icon :size="20">
          <Tickets/>
        </el-icon>
        订单
      </el-menu-item>

      <el-menu-item index="/dashboard">
        <el-icon :size="20">
          <User/>
        </el-icon>
        个人
      </el-menu-item>


      <el-menu-item index="" @click="logout">
        <el-icon :size="20">
          <SwitchButton/>
        </el-icon>
      </el-menu-item>
    </el-menu>
  </el-header>

</template>


<style scoped>
.el-menu {
  height: 50px;
}

.flex-grow {
  flex-grow: 1;
}

.header {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 50px;
}

.bw-icon{
  width: 30px;
}

</style>
