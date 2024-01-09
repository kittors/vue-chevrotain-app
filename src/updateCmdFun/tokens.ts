import { createToken,Lexer } from 'chevrotain';

const Number = createToken({ name: "Number", pattern: /\d+/ }); //整数
const AlphaNumeric = createToken({ name: "AlphaNumeric", pattern: /(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+/ }); //大写或小写字母或数字任意组合 表名 标识名
const LeftBracket = createToken({ name: "LeftBracket", pattern: /\[/ });//左中括号
const Comma = createToken({ name: "Comma", pattern: /,/ });//逗号
const RightBracket = createToken({ name: "RightBracket", pattern: /\]/ }); //右中括号
const Condition = createToken({ name: 'Condition', pattern: /'[^']*'/ }); // 匹配双引号包裹的字符串 条件
const LParen = createToken({ name: "LParen", pattern: /\(/ })//左括号
const RParen = createToken({ name: "RParen", pattern: /\)/ })//右括号
const StringLiteral = createToken({ name: "StringLiteral", pattern: /"(\d+)"/ }) //判断值
const Operator = createToken({ name: "Operator", pattern: /[A-Z]\$/ }) //操作符 $R $L

//运算符
const Plus = createToken({ name: 'Plus', pattern: /\+/ });
const Minus = createToken({ name: 'Minus', pattern: /-/ });
const Multiply = createToken({ name: 'Multiply', pattern: /\*/ });
const Divide = createToken({ name: 'Divide', pattern: /\// });
const Integer = createToken({ name: 'Integer', pattern: /\d+/ });

//比较符
const Greater = createToken({ name: "Greater", pattern: />[^=]/ }) //比较符大于
const Less = createToken({ name: "Less", pattern: /<([^=]&[^>])/ }) //比较符小于
const GreaterOrEqual  = createToken({ name: "GreaterOrEqual", pattern: />=/ }) //比较符大于等于
const LessOrEqual  = createToken({ name: "LessOrEqual", pattern: /<=/ }) //比较符小于等于
const NotEqual  = createToken({ name: "NotEqual", pattern: /<>/ }) //比较符不等于
const Equals = createToken({ name: "Equals", pattern: /=/ })//等号

//跳过空格
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});
export {
    Number,
    AlphaNumeric,
    LeftBracket,
    Comma,
    RightBracket,
    Condition,
    Equals,
    LParen,
    RParen,
    StringLiteral,
    Operator,
    Plus,
    Minus,
    Multiply,
    Divide,
    Integer,
    Greater,
    Less,
    GreaterOrEqual,
    LessOrEqual,
    NotEqual,
    WhiteSpace
}