import {CstParser} from 'chevrotain';
import {Plus, Minus, Multiply, Divide, LParen, RParen, Number, String, NumberTable, LogoTable} from "./tokens";

const allTokens = [Plus, Minus, Multiply, Divide, LParen, RParen, Number, String, NumberTable, LogoTable]

// 解析器类
export class OperationsParse extends CstParser {
    constructor() {
        super(allTokens);
    }

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
            // {
                // ALT: () => {
                //     this.SUBRULE(this.mixStructure.MixStructureExpression);
                // }
            // },
            {ALT: () => this.CONSUME(Number)},
            {ALT: () => this.CONSUME(String)},
            {ALT: () => this.CONSUME(NumberTable)},
            {ALT: () => this.CONSUME(LogoTable)},
            {
                ALT: () => {
                    this.CONSUME(LParen);
                    this.SUBRULE1(this.operationsExpression); // 获取括号内的表达式值
                    this.CONSUME(RParen);
                }
            }
        ]);
    });

}
