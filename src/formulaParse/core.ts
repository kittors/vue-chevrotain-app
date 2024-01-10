import { CstParser, Lexer } from "chevrotain";
import Tokens from './tokens'
const allTokens = Object.values(Tokens)
const lexer = new Lexer(allTokens)

class MyParser extends CstParser {
    constructor() {
        super(allTokens)
        this.performSelfAnalysis()
    }

    //最大结构
    public handleParse = this.RULE('handleParse', () => {
        this.SUBRULE(this.SheetNameAndCellCode)
    })

    //表名+单元格编号 SheetNameAndCellCode
    public SheetNameAndCellCode = this.RULE('SheetNameAndCellCode', () => {
        this.CONSUME(Tokens.TableName)
        this.CONSUME(Tokens.LeftBracket)
        this.CONSUME1(Tokens.Number)
        this.CONSUME(Tokens.Comma)
        this.CONSUME2(Tokens.Number)
        this.CONSUME(Tokens.RightBracket)
    })
}

// 实例化解析器
const parser = new MyParser()

// 解析函数
export default function parse(input: string) {
    console.log(input)
    const lexingResult = lexer.tokenize(input);
    console.log(lexingResult.tokens.map(token => `${token.image} (${token.tokenType.name})`));
    if (lexingResult.errors.length > 0) {
        throw new Error("词法分析错误");
    }

    // 设置解析器的输入
    parser.input = lexingResult.tokens;

    // 执行解析
    const cst = parser.handleParse();

    if (parser.errors.length > 0) {
        console.log(parser.errors)
        throw new Error("解析错误");
    }

    return cst;
}