import { CstParser, Lexer } from 'chevrotain'
import Tokens from '../tokens'

const allTokens = Object.values(Tokens)
/**
 * IF (Z06[2,4] + z08[PC,$R(2)])<>"2" THEN Z06[2,4]<=Z03[2,2]
 * 
 */
// 为所有 token 创建一个 Lexer 实例
const lexer = new Lexer(allTokens)

class MyParser extends CstParser {
    constructor() {
        super(allTokens)
        //执行
        this.performSelfAnalysis();

    }

    //IF THEN ELSE解析 
    public ifthenStatement = this.RULE("ifthenStatement", () => {
        this.OR([{
            ALT: () => {
                this.SUBRULE(this.ifthenStatement)
            }
        }, {
            ALT: () => {
                this.SUBRULE(this.conditionJuge)
            }
        }])
    })

    //条件判断
    public conditionJuge = this.RULE("conditionJuge", () => {
        this.CONSUME(Tokens.If)
        // 解析条件表达式
        this.SUBRULE1(this.expression);
        this.CONSUME(Tokens.Then)
        // 解析条件表达式
        this.SUBRULE2(this.expression);
        //可选条件
        this.OPTION(() => {
            this.CONSUME(Tokens.Else);
            this.SUBRULE3(this.expression); // ELSE 后的表达式
        });
    })

    //定义二级结构
    public expression = this.RULE('expression', () => {
        // 定义表达式解析逻辑 关键字集合
        this.OR([
            { ALT: () => this.SUBRULE(this.keywordCollection) },
            { ALT: () => this.SUBRULE(this.getValuebyCellCode) }
        ])
        this.OR([
            { ALT: () => this.CONSUME(Tokens.NotEqual) }, //<>
            { ALT: () => this.CONSUME(Tokens.Equal) }, // =
            { ALT: () => this.CONSUME(Tokens.GreaterThanOrEqual) }, //>=
            { ALT: () => this.CONSUME(Tokens.LessThanOrEqual) }, // <=
            { ALT: () => this.CONSUME(Tokens.GreaterThan) }, // >
            { ALT: () => this.CONSUME(Tokens.LessThan) }, //<
        ])
        this.OR([
            { ALT: () => this.SUBRULE(this.numValue) },
            { ALT: () => this.SUBRULE(this.getValuebyCellCode) }
        ])
        // 例如，处理标识符、函数调用、运算符等
    });

    //类似z02[2,2]
    public getValuebyCellCode = this.RULE("getValuebyCellCode", () => {

    })
    //类似 "2"
    public numValue = this.RULE("numValue", () => {

    })
    //关键字标识集合例如BBLX
    public keywordCollection = this.RULE("keywordCollection", () => { })
}

// 实例化解析器
const parser = new MyParser()


// 解析函数
export default function parse(input: string) {
    const lexingResult = lexer.tokenize(input);
    if (lexingResult.errors.length > 0) {
        throw new Error("词法分析错误");
    }

    // 设置解析器的输入
    parser.input = lexingResult.tokens;

    // 执行解析
    const cst = parser.ifthenStatement();

    if (parser.errors.length > 0) {
        throw new Error("解析错误");
    }

    return cst;
}