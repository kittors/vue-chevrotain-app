import { createToken } from 'chevrotain';

const Number = createToken({ name: "Number", pattern: /\d+/ }); //整数
const AlphaNumeric = createToken({ name: "AlphaNumeric", pattern: /(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+/ }); //大写或小写字母或数字任意组合 表名 标识名
const LeftBracket = createToken({ name: "LeftBracket", pattern: /\[/ });//左中括号
const Comma = createToken({ name: "Comma", pattern: /,/ });//逗号
const RightBracket = createToken({ name: "RightBracket", pattern: /\]/ }); //右中括号
const Condition = createToken({ name: 'Condition', pattern: /'[^']*'|"[^"]*"/ }); // 匹配双引号包裹的字符串 条件
const Equals = createToken({ name: "Equals", pattern: /=/ })//等号
const LParen = createToken({ name: "LParen", pattern: /\(/ })//左括号
const RParen = createToken({ name: "RParen", pattern: /\)/ })//右括号
const StringLiteral = createToken({ name: "StringLiteral", pattern: /"(\d+)"/ }) //判断值
const Operator = createToken({ name: "Operator", pattern: /[A-Z]\$/ }) //操作符 $R $L

export { Number, AlphaNumeric, LeftBracket, Comma, RightBracket, Condition, Equals, LParen, RParen, StringLiteral, Operator }