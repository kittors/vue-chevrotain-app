import {CstParser} from 'chevrotain'
import {
    AND,
    OR,
    NOT,
    Number,
    String,
    LeftBracket,
    Comma,
    RightBracket,
    TableName,
    Identifying,
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
    SUM,
    WhiteSpace
} from './tokens'

export const allTokens = [IF, THEN, ELSE, AND, OR, NOT, SUM, Number, String, LeftBracket, Comma, RightBracket, TableName, Identifying, Condition, Equals, LParen, RParen, StringLiteral, Operator, Plus, Minus, Multiply, Divide, GreaterOrEqual, LessOrEqual, NotEqual, Greater, Less, WhiteSpace]

export class CstToParse extends CstParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    public expression = this.RULE("expression", () => {
        this.SUBRULE(this.conditionalExpression)
    })

    public conditionalExpression = this.RULE('conditionalExpression', () => {
        this.OR([
            {ALT: () => this.SUBRULE1(this.ifThenElseExpression)},
            {ALT: () => this.SUBRULE(this.orExpression)},
        ])
    });

    // 对if then else 整体进行解析
    public ifThenElseExpression = this.RULE('ifThenElseExpression', () => {
        this.SUBRULE(this.ifExpression)
        this.SUBRULE1(this.thenExpression)
        this.OPTION(() => {
            this.SUBRULE2(this.elseExpression)
        })
    });

    // if
    public ifExpression = this.RULE('ifExpression', () => {
        this.CONSUME(IF);
        this.SUBRULE(this.orExpression)
    });

    // then
    public thenExpression = this.RULE('thenExpression', () => {
        this.CONSUME(THEN);
        this.SUBRULE(this.orExpression)
    });

    // else
    public elseExpression = this.RULE('elseExpression', () => {
        this.CONSUME(ELSE);
        this.SUBRULE(this.orExpression)
    });

    //or
    public orExpression = this.RULE('orExpression', () => {
        this.SUBRULE(this.andExpression)
        this.MANY(() => {
            this.CONSUME1(OR)
            this.SUBRULE1(this.andExpression)
        })
    });

    //and
    public andExpression = this.RULE('andExpression', () => {
        this.SUBRULE(this.comparisonExpression)
        this.MANY(() => {
            this.CONSUME1(AND)
            this.SUBRULE1(this.comparisonExpression)
        })
    });

    /**
     * 比较运算符
     */
    public comparisonExpression = this.RULE('comparisonExpression', () => {
        this.MANY(() => {
            this.CONSUME(NOT);
        })
        this.SUBRULE(this.plusOrMinExpression)
        this.OPTION(() => {
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME1(GreaterOrEqual)
                        this.SUBRULE1(this.plusOrMinExpression)
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME2(LessOrEqual)
                        this.SUBRULE2(this.plusOrMinExpression)
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME3(NotEqual)
                        this.SUBRULE3(this.plusOrMinExpression)
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME4(Less)
                        this.SUBRULE4(this.plusOrMinExpression)
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME5(Greater)
                        this.SUBRULE5(this.plusOrMinExpression)
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME6(Equals)
                        this.SUBRULE6(this.plusOrMinExpression)
                    }
                },
            ])

        })
    });

    // 处理加减
    public plusOrMinExpression = this.RULE('plusOrMinExpression', () => {
        this.SUBRULE(this.multiplyOrDivExpression)
        this.MANY(() => {
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(Plus)
                        this.SUBRULE1(this.multiplyOrDivExpression)
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME(Minus)
                        this.SUBRULE2(this.multiplyOrDivExpression)
                    }
                },
            ])
        })
    });

    // 处理乘除
    public multiplyOrDivExpression = this.RULE('multiplyOrDivExpression', () => {
        this.SUBRULE(this.atomicExpression)
        this.MANY(() => {
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(Multiply)
                        this.SUBRULE1(this.atomicExpression)
                    }
                },
                {
                    ALT: () => {
                        this.CONSUME(Divide)
                        this.SUBRULE2(this.atomicExpression)
                    }
                },
            ])
        })
    });

    // 处理括号
    public atomicExpression = this.RULE('atomicExpression', () => {
        this.OR([
            {
                ALT: () => {
                    this.SUBRULE(this.mixStructureExpression);
                }
            },
            {
                ALT: () => {
                    this.CONSUME(LParen);
                    this.SUBRULE1(this.orExpression); // 获取括号内的表达式值
                    this.CONSUME(RParen);
                }
            }
        ]);
    });

    // 消耗单元格、数字、字符串、函数
    public mixStructureExpression = this.RULE('MixStructureExpression', () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.table)},
            {ALT: () => this.CONSUME(Number)},
            {ALT: () => this.CONSUME(String)},
            {ALT: () => this.SUBRULE(this.sumFunction)}
        ]);
    });

    //拆解z01[1,2] z01[1,2,''] z01[PC] z01[PC,'']
    public table = this.RULE("table", () => {
        this.CONSUME(TableName)
        this.CONSUME1(LeftBracket)
        this.SUBRULE(this.cellExpression)
        this.OPTION(() => {
            this.CONSUME6(Comma)
            this.CONSUME7(Condition)
            this.OPTION1(() => {
                this.SUBRULE(this.orExpression)
            })
            this.CONSUME8(Condition)
        })
        this.CONSUME9(RightBracket)
    })

    // 单元格
    public cellExpression = this.RULE('cellExpression', () => {
        this.OR([
            {ALT: () => this.SUBRULE(this.numberCellExpression)},
            {ALT: () => this.SUBRULE(this.identifyingCellExpression)},
        ]);
    });

    // 编号类型单元格
    public numberCellExpression = this.RULE('numberCellExpression', () => {
        this.CONSUME2(Number)
        this.CONSUME3(Comma)
        this.CONSUME4(Number)
    });

    // 标识类型单元格
    public identifyingCellExpression = this.RULE('identifyingCellExpression', () => {
        this.CONSUME5(Identifying)
    });

    public sumFunction = this.RULE('sumFunction', () => {
        this.CONSUME(SUM)
        this.CONSUME1(LParen)
        this.OR([
            {ALT: () => this.SUBRULE(this.table)},
            {ALT: () => this.CONSUME3(Number)},
        ])
        this.MANY(() => {
            this.CONSUME4(Comma)
            this.OR1([
                {ALT: () => this.SUBRULE1(this.table)},
                {ALT: () => this.CONSUME5(Number)},
            ])
        })
        this.CONSUME6(RParen)
    });
}

export const parser = new CstToParse();
