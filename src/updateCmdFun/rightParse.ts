

// import { splitStringByAnd } from '../utils/utils'
import { Lexer, CstParser } from 'chevrotain';

import { Number, AlphaNumeric, LeftBracket, Comma, RightBracket, Condition } from './tokens'


const allTokens = [Number, AlphaNumeric, LeftBracket, Comma, RightBracket, Condition]
// 创建 Lexer
const lexer = new Lexer(allTokens);

//条件
class QueryBycondition extends CstParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    public expression = this.RULE('expression', () => {
        this.SUBRULE(this.sheetName);
        this.CONSUME(LeftBracket);
        this.CONSUME1(Number); // 使用 Number 的第一次
        this.CONSUME1(Comma);  // 使用 Comma 的第一次
        this.CONSUME2(Number); // 使用 Number 的第二次
        this.CONSUME2(Comma);  // 使用 Comma 的第二次
        this.SUBRULE(this.condition);
        this.CONSUME(RightBracket);
    });


    private sheetName = this.RULE('sheetName', () => {
        this.CONSUME(AlphaNumeric);
    });

    private condition = this.RULE('condition', () => {
        this.CONSUME(Condition);
    });
}

// 创建解析器实例并尝试解析
const parser = new QueryBycondition();

const parseRight = (str: string) => {
    const lexingResult = lexer.tokenize(str)
    // 解析
    parser.input = lexingResult.tokens;
    const cst = parser.expression();
    // 检查是否有解析错误
    if (parser.errors.length > 0) {
        throw new Error(`Parsing errors detected: ${parser.errors}`);
    }

    return toSql(cst)
}

// 根据 CST 构建 SQL 语句
function toSql(cst: any) {
    const sheetName = cst.children.sheetName[0].children.AlphaNumeric[0].image;
    const condition = cst.children.condition[0].children.Condition[0].image;
    const cellCode = `[${cst.children.Number[0].image
        },${cst.children.Number[1].image
        }]`
    return { cellCode, sheetName, condition };
}

export default parseRight