import { CstParser, Lexer } from 'chevrotain';
import { Number, AlphaNumeric, LeftBracket, Comma, RightBracket, Equals, LParen, RParen, StringLiteral, Operator } from './tokens'

// 词法标记定义
function defineTokens() {
    return {
        Operator: Operator,
        AlphaNumeric: AlphaNumeric,
        Number: Number,
        Comma: Comma,
        Equals: Equals,
        LBracket: LeftBracket,
        RBracket: RightBracket,
        LParen: LParen,
        RParen: RParen,
        StringLiteral: StringLiteral
    };
}

const tokens = defineTokens();
const allTokens = Object.values(tokens);
const ParserLexer = new Lexer(allTokens);

// 词法解析器
class ParserCstParser extends CstParser {
    constructor() {
        super(allTokens);
        this.defineRules();
    }

    defineRules() {
        this.RULE("expression", this.expressionRule);
        this.RULE("operation", this.operationRule);
        this.performSelfAnalysis();
    }

    expressionRule() {
        this.SUBRULE((this as any).operation);
        this.CONSUME(tokens.Equals);
        this.CONSUME(tokens.StringLiteral);
    }

    operationRule() {
        this.CONSUME(tokens.Operator);
        this.CONSUME(tokens.LParen);
        this.CONSUME1(tokens.AlphaNumeric);
        this.CONSUME(tokens.LBracket);
        this.CONSUME2(tokens.AlphaNumeric);
        this.CONSUME(tokens.RBracket);
        this.CONSUME(tokens.Comma);
        this.CONSUME(tokens.Number);
        this.CONSUME(tokens.RParen);
    }
}

const parser = new ParserCstParser();

// 解析输入
export default function parse(input: string) {
    const lexingResult = ParserLexer.tokenize(input);
    parser.input = lexingResult.tokens;
    const cst = (parser as any).expression();

    if (parser.errors.length > 0) {
        throw new Error("解析错误: " + parser.errors[0].message);
    }

    return extractDataFromCST(cst);
}

function extractDataFromCST(cst: any) {
    return {
        operatorChar: cst.children.operation[0].children.Operator[0].image,
        sheetName: cst.children.operation[0].children.AlphaNumeric[0].image,
        identifier: cst.children.operation[0].children.AlphaNumeric[1].image,
        value: cst.children.StringLiteral[0].image,
        operatorValue: cst.children.operation[0].children.Number[0].image
    };
}
