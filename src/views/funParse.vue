<template>
  <div>解析公式</div>
</template>

<script setup lang="ts">
import parse from "../formulaParse/core";
const str = `z02[2,3]`;
try {
  const cst = parse(str);
  console.log(cst);
} catch (error) {
  console.log(error);
}
</script>

<style scoped lang="less"></style>
