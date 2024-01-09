<template>
  <div>
    <el-input v-model="input" placeholder="请输入公式" style="width: 500px" />
    <el-button
      type="primary"
      @click="parseFunction"
      style="margin-top: 10px; display: block"
      >解析公式</el-button
    >
    <el-text
      class="mx-1"
      size="large"
      style="display: block; margin-top: 10px"
      >{{ result }}</el-text
    >
    <el-text
      class="mx-1"
      size="large"
      style="display: block; margin-top: 10px"
      >{{ errMsg }}</el-text
    >
  </div>
</template>

<script setup lang="ts">
import parse from "../formulaTest";
parse("2+5*8/(9+1)*9+8");
import { ElMessage } from "element-plus";
import parseFun from "../updateCmdFun";
import { ref } from "vue";
const input = ref(
  `Z02[2,2]=Z02[2,1,'Z02[ZCWJMC]="001000" and R$(Z02[PC],2)="01"']`
);
const result = ref<object | string>("暂无结果");
const errMsg = ref("暂无错误");
interface ERRMSG {
  message: string;
}

const parseFunction = () => {
  try {
    const parseResult = parseFun(input.value);
    result.value = parseResult as object;
  } catch (error) {
    console.error((error as ERRMSG).message);
    ElMessage.error("公式格式错误");
    errMsg.value = error as string;
  }
};

// const parseLongStr = () => {};

// const str = `Z02[2,2]=Z02[2,1,'Z02[ZCWJMC]="001000" and R$(Z02[PC],2)="01"']`;
</script>

<style scoped lang="less"></style>
