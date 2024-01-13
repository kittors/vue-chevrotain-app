// main.ts
import { Lexer } from 'chevrotain';
import { parser } from './cstToParse'; // 导入解析器实例
import { astBuilder } from './astParse'; // 导入访问者类

import {AND, OR, NOT, Number, String, LeftBracket, Comma, RightBracket, TableName, Identifying, Condition, Equals, LParen, RParen, StringLiteral, Operator, Plus, Minus, Multiply, Divide, IF, THEN, ELSE, Greater, Less, GreaterOrEqual, LessOrEqual, NotEqual, SUM, WhiteSpace} from './tokens'
export const allTokens = [IF, THEN, ELSE, AND, OR, NOT, SUM, Number, String, LeftBracket, Comma, RightBracket, TableName, Identifying, Condition, Equals, LParen, RParen, StringLiteral, Operator, Plus, Minus, Multiply, Divide, GreaterOrEqual, LessOrEqual, NotEqual, Greater, Less, WhiteSpace]
const lexer = new Lexer(allTokens);

export function parse(text: string) {
    // 清除解析器的状态
    parser.input = [];
    const lexingResult = lexer.tokenize(text);

    if (lexingResult.errors.length > 0) {
        throw new Error('Lexing errors detected');
    }

    parser.input = lexingResult.tokens;
    const cst = parser.expression();

    // 使用访问者来从CST得到AST
    let ast = null;

    if (parser.errors.length > 0) {
        console.error('报错信息：' , parser.errors)
        console.error('报错内容：' + parser.errors[0].token.image)
        console.error('报错开始位置：' + parser.errors[0].token.startColumn, '报错结束位置：' + parser.errors[0].token.endColumn)
        console.error('报错消息：' + parser.errors[0].message)
    }else{
        ast = astBuilder.visit(cst)
    }
    console.log(ast)
    return {cst,ast};
}