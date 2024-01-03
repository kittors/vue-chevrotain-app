import { Lexer, CstParser } from 'chevrotain';

import { AlphaNumeric, LeftBracket, RightBracket, Equals, StringLiteral } from './tokens'

const allTokens = [AlphaNumeric, LeftBracket, RightBracket, Equals, StringLiteral];
const MyLexer = new Lexer(allTokens);

// 解析器
class MyParser extends CstParser {
    constructor() {
        super(allTokens);
        this.RULE("expression", () => {
            this.SUBRULE((this as any).sheetExpression);
            this.CONSUME(Equals);
            this.CONSUME(StringLiteral);
        });

        this.RULE("sheetExpression", () => {
            this.CONSUME1(AlphaNumeric); // 第一个 AlphaNumeric 视为 SheetName
            this.CONSUME(LeftBracket);
            this.CONSUME2(AlphaNumeric); // 第二个 AlphaNumeric 视为 Identifier
            this.CONSUME(RightBracket);
        });

        this.performSelfAnalysis();
    }
}

const parser = new MyParser();

// 解析方法
function normalParse(inputText: string) {
    const lexingResult = MyLexer.tokenize(inputText);
    parser.input = lexingResult.tokens;
    const cst = (parser as any).expression();

    if (parser.errors.length > 0) {
        throw new Error("解析错误: " + parser.errors[0].message);
    }

    // 提取数据
    return {
        sheetName: cst.children.sheetExpression[0].children.AlphaNumeric[0].image,
        identifier: cst.children.sheetExpression[0].children.AlphaNumeric[1].image,
        value: cst.children.StringLiteral[0].image
    };
}

export { normalParse }
