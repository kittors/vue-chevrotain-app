import {CstParser, Lexer} from 'chevrotain'
import {
    Number,
    String,
    LeftBracket,
    Comma,
    RightBracket,
    NumberTable,
    LogoTable,
    TableName,
    NumberTableCell,
    LogoTableCell,
    Condition,
    Equals,
    LParen,
    RParen,
    StringLiteral,
    Operator,
    Plus,
    Minus,
    Multiply,
    Divide,
    IF,
    THEN,
    ELSE,
    Greater,
    Less,
    GreaterOrEqual,
    LessOrEqual,
    NotEqual,
    WhiteSpace
} from './tokens.ts'

export const allTokens = [Number,
    String,
    LeftBracket,
    Comma,
    RightBracket,
    NumberTable,
    LogoTable,
    TableName,
    NumberTableCell,
    LogoTableCell,
    Condition,
    Equals,
    LParen,
    RParen,
    StringLiteral,
    Operator,
    Plus,
    Minus,
    Multiply,
    Divide,
    IF,
    THEN,
    ELSE,
    Greater,
    Less,
    GreaterOrEqual,
    LessOrEqual,
    NotEqual,
    WhiteSpace]

export class MainParser extends CstParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    public expression = this.RULE("expression", () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.operationsExpression)},
            {ALT: () => this.SUBRULE(this.conditionalExpression)},
        ])
    })

    public operationsExpression = this.RULE('operationsExpression', () => {
        this.SUBRULE(this.additionExpression);
    });

    public additionExpression = this.RULE('additionExpression', () => {
        this.SUBRULE(this.multiplicationExpression); // 第一次调用，不需要特殊后缀
        this.MANY(() => {
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(Plus);
                        this.SUBRULE1(this.multiplicationExpression);
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME(Minus);
                        this.SUBRULE2(this.multiplicationExpression);
                    }
                }
            ]);
        });
    });

    public multiplicationExpression = this.RULE('multiplicationExpression', () => {
        this.SUBRULE(this.atomicExpression); // 第一次调用，不需要特殊后缀
        this.MANY(() => {
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(Multiply);
                        this.SUBRULE1(this.atomicExpression);
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME(Divide);
                        this.SUBRULE2(this.atomicExpression);
                    }
                }
            ]);
        });
    });
    public atomicExpression = this.RULE('atomicExpression', () => {
        this.OR([
            {
                ALT: () => {
                    // @ts-ignore
                    this.SUBRULE(this.mixStructureExpression);
                }
            },
            {
                ALT: () => {
                    this.CONSUME(LParen);
                    this.SUBRULE1(this.operationsExpression); // 获取括号内的表达式值
                    this.CONSUME(RParen);
                }
            }
        ]);
    });

    public conditionalExpression = this.RULE('conditionalExpression', () => {
        this.CONSUME(IF);
        this.SUBRULE(this.expression)
        this.CONSUME1(THEN);
        this.SUBRULE1(this.expression)
        this.OPTION(()=>{
            this.CONSUME2(ELSE);
            this.SUBRULE2(this.expression)
        })
    });

    public mixStructureExpression = this.RULE('MixStructureExpression', () => {
        this.OR([
            {ALT: () => this.CONSUME(NumberTable)},
            {ALT: () => this.CONSUME(LogoTable)},
            {ALT: () => this.CONSUME(Number)},
            {ALT: () => this.CONSUME(String)},
        ]);
    });
}

// 可以在这里添加一个函数来执行解析并处理错误。
export function parse(text: string) {
    const lexer = new Lexer(allTokens);
    const parser = new MainParser();
    console.log(parser)
    const lexingResult = lexer.tokenize(text);
    parser.input = lexingResult.tokens;
    const cst = parser.expression();

    if (parser.errors.length > 0) {
        console.error(parser.errors)
    }
    console.log(cst)
    return cst;
}