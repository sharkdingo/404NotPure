<script setup lang="ts">

import StoreOrders from "../../components/orders/StoreOrders.vue";
import UserOrders from "../../components/orders/UserOrders.vue";
import AllOrders from "../../components/orders/AllOrders.vue";


const role = sessionStorage.getItem("role");
</script>

<template>
  <UserOrders v-if="role=='CUSTOMER'"/>
  <StoreOrders v-if="role=='STAFF'"/>
  <AllOrders v-if="role=='MANAGER'||role=='CEO'"/>
</template>

<style scoped>

</style>