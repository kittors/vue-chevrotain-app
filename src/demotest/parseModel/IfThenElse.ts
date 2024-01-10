import { CstParser, Lexer, IToken } from 'chevrotain'

import Tokens from '../tokens'

const { If, Then, Else } = Tokens
const allTokens = [If, Then, Else]
const lexer = new Lexer(allTokens);
class MyParser extends CstParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }
    public ifStatement = this.RULE("ifStatement", () => {
        let ifPart = null;
        let thenPart = null;
        let elsePart = null;
        // 检查 IF 后是否跟随 THEN
        const thenToken = this.OPTION(() => this.CONSUME(Then));
        if (thenToken) {
            thenPart = thenToken.image;
        } else {
            throw new Error("THEN keyword is missing.");
        }

        // 检查 THEN 后是否有 ELSE
        const elseToken = this.OPTION1(() => this.CONSUME(Else));
        if (elseToken) {
            elsePart = elseToken.image;
            return { type: "IFTHENELSE", IF: ifPart, THEN: thenPart, ELSE: elsePart };
        }

        return { type: "IFTHEN", IF: ifPart, THEN: thenPart };
    })
}

// 创建解析器实例
const parser = new MyParser();

export default function parse(str: string) {
    const lexingResult = lexer.tokenize(str);
    if (lexingResult.errors.length > 0) {
        throw new Error("Lexing errors detected");
    }
    parser.input = lexingResult.tokens;
    const result = parser.ifStatement();
    return result
}
