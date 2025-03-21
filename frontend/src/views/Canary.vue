<script setup lang="ts">
import PayDialogPlus from "../components/pay/PayDialogPlus.vue";
import {onMounted, ref} from "vue";

const payDialogPlus = ref();

onMounted(() => {
  payDialogPlus.value.openDialog();
});

</script>

<template>
  <PayDialogPlus ref="payDialogPlus"></PayDialogPlus>
</template>

<style scoped>

</style>