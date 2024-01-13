import { createToken, Lexer } from 'chevrotain';

//运算符
const Plus = createToken({ name: 'Plus', pattern: /\+/ });
const Minus = createToken({ name: 'Minus', pattern: /-/ });
const Multiply = createToken({ name: 'Multiply', pattern: /\*/ });
const Divide = createToken({ name: 'Divide', pattern: /\// });

//比较符
const Greater = createToken({ name: "Greater", pattern: />[^=]/ }) //比较符大于
const Less = createToken({ name: "Less", pattern: /<([^=]&[^>])/ }) //比较符小于
const GreaterOrEqual = createToken({ name: "GreaterOrEqual", pattern: />=/ }) //比较符大于等于
const LessOrEqual = createToken({ name: "LessOrEqual", pattern: /<=/ }) //比较符小于等于
const NotEqual = createToken({ name: "NotEqual", pattern: /<>/ }) //比较符不等于
const Equals = createToken({ name: "Equals", pattern: /=/ })//等号

const SingleQuote = createToken({
    name: 'SingleQuote',
    pattern: /'/ // 正则表达式匹配单个单引号字符
});

const Ampersand = createToken({
    name: 'Ampersand',
    pattern: /&/
});

//判断
const IF = createToken({ name: "IF", pattern: /if/i });
const THEN = createToken({ name: "THEN", pattern: /then/i });
const ELSE = createToken({ name: "ELSE", pattern: /else/i });

const Number = createToken({ name: "Number", pattern: /\d+/ }); //数字
const String = createToken({ name: "String", pattern: /"[^"]"/ }); //字符串
const TableName = createToken({ name: "TableName", pattern: /[A-Za-z_][A-Za-z_0-9]*/ }) //表名 z02 zc02

const LeftBracket = createToken({ name: "LeftBracket", pattern: /\[/ });//左中括号
const Comma = createToken({ name: "Comma", pattern: /,/ });//逗号
const RightBracket = createToken({ name: "RightBracket", pattern: /\]/ }); //右中括号
const LParen = createToken({ name: "LParen", pattern: /\(/ })//左括号
const RParen = createToken({ name: "RParen", pattern: /\)/ })//右括号
const StringLiteral = createToken({ name: "StringLiteral", pattern: /"(\d+)"/ }) //判断值
const Operator = createToken({ name: "Operator", pattern: /[A-Z]\$/ }) //操作符 $R $L

//跳过空格
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});
export default {
    Ampersand,
    SingleQuote,
    IF,
    THEN,
    ELSE,
    Number,
    String,
    LeftBracket,
    Comma,
    RightBracket,
    TableName,
    Equals,
    LParen,
    RParen,
    StringLiteral,
    Operator,
    Plus,
    Minus,
    Multiply,
    Divide,
    Greater,
    Less,
    GreaterOrEqual,
    LessOrEqual,
    NotEqual,
    WhiteSpace
}