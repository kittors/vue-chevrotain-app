<script setup lang="ts">
import {parse} from '../formulaTest/main'
import {ref} from "vue";

let input = ref<string>(`if not a4[4,5]=0 then a88[4,5,'not sd15[1,1,''] + 1>0']+5-8*(6-2)>15 else 2+8 = 1 + SUM(1,2,z02[2,1,''])`)
// let input = ref<string>(`z02[asdas,'1or0or8or9']`)

const parseFormula = () => {
  parse(input.value)
}
parseFormula()
</script>

<template>
  <div style="margin: 20px;box-sizing: border-box">
    <div>
      <input v-model="input" autofocus @keydown.enter="parseFormula" style="width: 100%;font-size: 18px;">
    </div>
    <button @click="parseFormula" style="width: 100px;height: 40px;margin-top: 10px;">解析</button>
  </div>
</template>

<style scoped lang="less">

</style>