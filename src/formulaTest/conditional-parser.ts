// conditional-parser.ts
import {CstParser} from 'chevrotain'
import {Greater, Less, GreaterOrEqual, LessOrEqual, NotEqual} from "./tokens";

const allTokens = [ Greater, Less, GreaterOrEqual, LessOrEqual, NotEqual,]

export class ConditionalParser extends CstParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    public conditionalExpression = this.RULE("conditionalExpression", () => {
        // 定义条件表达式的解析规则
    });
    // 可能的其他方法或规则...
}