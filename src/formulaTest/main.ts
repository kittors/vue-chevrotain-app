// main-parser.ts
import {CstParser, Lexer} from 'chevrotain';
import {OperationsParse} from './operations-parse';
import {allTokens} from './leadIn';

export class MainParser extends CstParser {
    constructor() {
        super(allTokens);
        const operationsParse = new OperationsParse();
        this.operationsParse = {
            operationsExpression: operationsParse.operationsExpression.bind(operationsParse)
        }
        this.performSelfAnalysis();
    }

    public expression = this.RULE("expression", () => {
        console.log(this.operationsParse)
        this.OR([
            {ALT: () => this.SUBRULE(this.operationsParse.operationsExpression)},
        ]);
    });
}

export function parse1(text: string) {
    const lexer = new Lexer(allTokens);
    const parser = new MainParser();

    const lexingResult = lexer.tokenize(text);
    parser.input = lexingResult.tokens;
    const cst = parser.expression();

    if (parser.errors.length > 0) {
        throw new Error("Parsing errors detected");
    }

    console.log(cst);
    return cst;
}