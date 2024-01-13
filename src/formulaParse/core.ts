import { CstParser, Lexer, EOF, TokenType } from "chevrotain";
import Tokens from './tokens'
const allTokens = Object.values(Tokens)
const lexer = new Lexer(allTokens)
class MyParser extends CstParser {
    constructor() {
        super(allTokens)
        this.performSelfAnalysis()
    }

    //表达式
    public expression = this.RULE('expression', () => {
        this.SUBRULE(this.AdditiveExpression);
    });

    //加减
    public AdditiveExpression = this.RULE('AdditiveExpression', () => {
        this.SUBRULE(this.MultiplicativeExpression);
        this.MANY(() => {
            // 处理加号或减号
            this.OR([
                { ALT: () => this.CONSUME(Tokens.Plus) },
                { ALT: () => this.CONSUME(Tokens.Minus) }
            ]);
            this.SUBRULE2(this.MultiplicativeExpression);
        });
    });

    //乘除
    public MultiplicativeExpression = this.RULE('MultiplicativeExpression', () => {
        this.SUBRULE(this.AtomicExpression);
        this.MANY(() => {
            // 处理乘号或除号
            this.OR([
                { ALT: () => this.CONSUME(Tokens.Multiply) },
                { ALT: () => this.CONSUME(Tokens.Divide) }
            ]);
            this.SUBRULE2(this.AtomicExpression);
        });
    });

    //表名+单元格编号 SheetNameAndCellCode 
    public SheetNameAndCellCode = this.RULE('SheetNameAndCellCode', () => {
        this.CONSUME(Tokens.TableName)
        this.CONSUME(Tokens.LeftBracket)
        this.CONSUME1(Tokens.Number)
        this.CONSUME1(Tokens.Comma)
        this.CONSUME2(Tokens.Number)
        this.OPTION(() => {
            this.CONSUME2(Tokens.Comma)
            this.CONSUME1(Tokens.SingleQuote) //'
            this.SUBRULE(this.Condition) //condtion
            this.CONSUME2(Tokens.SingleQuote) //'
        })
        this.CONSUME(Tokens.RightBracket)
    })

    //累加 Z03[2,2,'']&Z03[2,3,'']
    public Summation = this.RULE('Summation', () => {
        this.SUBRULE1(this.SheetNameAndCellCode)
        this.CONSUME(Tokens.Ampersand)
        this.SUBRULE2(this.SheetNameAndCellCode)
    })

    //条件Z03[2,2,'condition'] condition所处的位置
    public Condition = this.RULE('Condition', () => { })

    //原子级表达式
    public AtomicExpression = this.RULE('AtomicExpression', () => {
        this.OR([
            {
                // 使用 GATE 函数来检查是否应该执行 Summation
                GATE: () => this.isNextToken(Tokens.Ampersand),
                ALT: () => { this.SUBRULE(this.Summation) }
            },
            {
                // 默认情况，执行 SheetNameAndCellCode
                ALT: () => { this.SUBRULE(this.SheetNameAndCellCode) }
            }, {
                ALT: () => { this.CONSUME(Tokens.Number) }
            },
            {
                ALT: () => {
                    this.CONSUME(Tokens.LParen);
                    this.SUBRULE(this.expression);
                    this.CONSUME(Tokens.RParen);
                }
            }
        ]);
    });

    //辅助函数 检查下一个token
    private isNextToken(token: TokenType) {
        console.log(token)
        // 检查接下来的令牌序列中是否存在 Ampersand
        let lookaheadIndex = 1;
        while (this.LA(lookaheadIndex).tokenType !== EOF) {
            if (this.LA(lookaheadIndex).tokenType === token) {
                return true;
            }
            lookaheadIndex++;
        }
        return false;
    }
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
    const cst = parser.expression();
    if (parser.errors.length > 0) {
        console.log(parser.errors)
        throw new Error("解析错误");
    }
    return cst;
}