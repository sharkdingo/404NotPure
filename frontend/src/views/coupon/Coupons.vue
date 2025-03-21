<script setup lang="ts">


import UserCoupons from "../../components/coupon-view/UserCoupons.vue";
import StoreCoupons from "../../components/coupon-view/StoreCoupons.vue";
import AllCoupons from "../../components/coupon-view/AllCoupons.vue";


const role = sessionStorage.getItem("role");
</script>

<template>
  <UserCoupons v-if="role=='CUSTOMER'"/>
  <StoreCoupons v-if="role=='STAFF'"/>
  <AllCoupons v-if="role=='MANAGER'||role=='CEO'"/>
</template>

<style scoped>

</style>