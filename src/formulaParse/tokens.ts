import { createToken, Lexer } from 'chevrotain'

// 定义加号的 Token
const Plus = createToken({ name: "Plus", pattern: /\+/ });

// 定义减号的 Token
const Minus = createToken({ name: "Minus", pattern: /-/ });

// 定义乘号的 Token
const Multiply = createToken({ name: "Multiply", pattern: /\*/ });

// 定义除号的 Token
const Divide = createToken({ name: "Divide", pattern: /\// });

//定义数字的Token
const Number = createToken({ name: "Number", pattern: /\d+/ });

//定义左括号的Token
const LParen = createToken({ name: "LParen", pattern: /\(/ });

//定义右括号的Token
const RParen = createToken({ name: "RParen", pattern: /\)/ });

//左中括号
const LBracket = createToken({ name: "LBracket", pattern: /\[/ });

//右中括号
const RBracket = createToken({ name: "RBracket", pattern: /\]/ });

//逗号
const Comma = createToken({ name: "Comma", pattern: /,/ });

//双引号
const DoubleQuote = createToken({ name: "DoubleQuote", pattern: /"/ });


//表名
const SheetName = createToken({ name: "SheetName", pattern: /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]+/ }); //大写或小写字母开头加数字 或者下划线的任意组合 

//IF THEN ELSE结构
const If = createToken({ name: 'If', pattern: /IF/i });
const Then = createToken({ name: 'Then', pattern: /THEN/i });
const Else = createToken({ name: 'Else', pattern: /ELSE/i });

//关键字
const BBLX = createToken({ name: 'BBLX', pattern: /BBLX/i });//报表类型
const INLIST = createToken({ name: 'INLIST', pattern: /INLIST/i });//是否在某个区间
const AND = createToken({ name: 'AND', pattern: /AND/i });
const OR = createToken({ name: 'OR', pattern: /OR/i });
const NOT = createToken({ name: 'NOT', pattern: /NOT/i });

//条件判断符号
const NotEqual = createToken({ name: 'NotEqual', pattern: /<>/ });//不等于
const Equal = createToken({ name: 'Equal', pattern: /=/ });//等于
const GreaterThanOrEqual = createToken({ name: 'GreaterThanOrEqual', pattern: />=/ });//大于等于
const LessThanOrEqual = createToken({ name: 'LessThanOrEqual', pattern: /<=/ });//小于等于
const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/ });//大于
const LessThan = createToken({ name: 'LessThan', pattern: /</ });//小于


//空格
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});

// 将所有 Tokens 组合到一个数组中
const allTokens = { Plus, Minus, Multiply, Divide, Number, LParen, RParen, LBracket, RBracket, Comma, SheetName, If, Then, Else, BBLX, INLIST, NotEqual, Equal, GreaterThanOrEqual, LessThanOrEqual, GreaterThan, LessThan, WhiteSpace, AND, NOT, OR, DoubleQuote };

export default allTokens