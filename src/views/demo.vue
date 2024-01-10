<template>
  <div class="main">
    <div class="title">解析器demo</div>
  </div>
</template>

<script setup lang="ts">
import { CstParser, Lexer, createToken } from "chevrotain";

// 定义 token
const Select = createToken({ name: "Select", pattern: /SELECT/ });
const From = createToken({ name: "From", pattern: /FROM/ });
const Identifier = createToken({ name: "Identifier", pattern: /\w+/ });
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// 为所有 token 创建一个 Lexer 实例
const lexer = new Lexer([Select, From, Identifier, WhiteSpace]);

// SQL 解析器类
class SqlParser extends CstParser {
  constructor() {
    super([Select, From, Identifier]);
    this.performSelfAnalysis();
  }

  public selectStatement = this.RULE("selectStatement", () => {
    this.CONSUME(Select);
    this.CONSUME1(Identifier);
    this.CONSUME(From);
    this.CONSUME2(Identifier);
  });
}

// 实例化解析器
const parser = new SqlParser();

// 解析函数
function parse(input: string) {
  const lexingResult = lexer.tokenize(input);
  if (lexingResult.errors.length > 0) {
    throw new Error("词法分析错误");
  }

  // 设置解析器的输入
  parser.input = lexingResult.tokens;

  // 执行解析
  const cst = parser.selectStatement();

  if (parser.errors.length > 0) {
    throw new Error("解析错误");
  }

  return cst;
}

// 测试解析器
try {
  const cst = parse("SELECT column1 FROM table1");
  console.log(JSON.stringify(cst, null, 2));
} catch (e) {
  console.error(e);
}
</script>

<style scoped lang="less"></style>
