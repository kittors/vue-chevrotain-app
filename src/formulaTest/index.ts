import {
    CstParser,
    TokenType,
    Lexer,
    createToken,
    ILexingResult,
} from 'chevrotain';
interface ASTNode {
    type: string;
    value?: number;
    left?: ASTNode;
    right?: ASTNode;
}
// 定义令牌
const Plus = createToken({ name: 'Plus', pattern: /\+/ });
const Minus = createToken({ name: 'Minus', pattern: /-/ });
const Multiply = createToken({ name: 'Multiply', pattern: /\*/ });
const Divide = createToken({ name: 'Divide', pattern: /\// });
const Integer = createToken({ name: 'Integer', pattern: /\d+/ });
const LParen = createToken({ name: 'LParen', pattern: /\(/ });
const RParen = createToken({ name: 'RParen', pattern: /\)/ });
const WhiteSpace = createToken({name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED,});
const allTokens: TokenType[] = [Plus, Minus, Multiply, Divide, Integer, LParen, RParen, WhiteSpace];
const CalculatorLexer = new Lexer(allTokens);

// 解析器类
class CalculatorParser extends CstParser {
    constructor() {
        super(allTokens);
        // 必须调用setRules方法来设置规则
        this.performSelfAnalysis();
    }

    public expression = this.RULE('expression', () => {
        return this.SUBRULE(this.additionExpression);
    });

    public additionExpression = this.RULE('additionExpression', () => {
        let value: ASTNode = this.SUBRULE(this.multiplicationExpression); // 第一次调用，不需要特殊后缀
        this.MANY(() => {
            this.OR([
                { ALT: () => {
                        const op = this.CONSUME(Plus).image;
                        const rightValue = this.SUBRULE1(this.multiplicationExpression);
                        value = {type: op, left: value, right: rightValue}
                    }
                },
                {
                    ALT: () => {
                        const op = this.CONSUME(Minus).image;
                        const rightValue = this.SUBRULE2(this.multiplicationExpression);
                        value = {type: op, left: value, right: rightValue}
                    }
                }
            ]);
        });
        return <ASTNode>value
    });

    public multiplicationExpression = this.RULE('multiplicationExpression', () => {
        let value: ASTNode = this.SUBRULE(this.atomicExpression); // 第一次调用，不需要特殊后缀
        this.MANY(() => {
            this.OR([
                { ALT: () => {
                        const op = this.CONSUME(Multiply).image;
                        const rightValue = this.SUBRULE1(this.atomicExpression);
                        value = {type: op, left: value, right: rightValue}
                    }},
                { ALT: () => {
                        const op = this.CONSUME(Divide).image;
                        const rightValue =this.SUBRULE2(this.atomicExpression);
                        value = {type: op, left: value, right: rightValue}
                    }}
            ]);
        });
        return <ASTNode>value
    });

    public atomicExpression = this.RULE('atomicExpression', () => {
        this.OR([
            { ALT: () => {
                    const value = this.CONSUME(Integer).image;
                    return <ASTNode>{ type: 'Integer', value: parseInt(value, 10) }; // 返回一个代表整数的AST节点
                }},
            { ALT: () => {
                    this.CONSUME(LParen);
                    const exprValue = this.SUBRULE(this.expression); // 获取括号内的表达式值
                    this.CONSUME(RParen);
                    return exprValue; // 直接返回该值，因为它已经是一个AST节点
                }}
        ]);
    });
}

// 使用解析器
const parser = new CalculatorParser();

// 解析文本
export default function parse(text: string): ASTNode | undefined {
    // 使用Lexer进行词法分析
    const lexResult: ILexingResult = CalculatorLexer.tokenize(text);
    // 设置parser的输入
    parser.input = lexResult.tokens;
    // 执行解析操作
    const cst = parser.expression();
    // 检查解析过程中是否有错误
    if (parser.errors.length > 0) {
        throw new Error('Parsing errors detected');
    }
    console.log(cst)
    // 先断言cst是ASTNode类型，因为我们已经在解析规则中确保了这一点
    return cst as ASTNode;
}