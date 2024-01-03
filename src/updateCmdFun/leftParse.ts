import { Lexer, CstParser } from 'chevrotain';
import { extractCharacter } from '../utils/utils'
import { Number, LeftBracket, Comma, RightBracket, AlphaNumeric } from './tokens'
// 使用新的类型定义 errorMessages

// 定义一个带有索引签名的类型
interface ErrorMessages {
    [key: string]: string;
}


const allTokens = [Number, AlphaNumeric, LeftBracket, Comma, RightBracket];


// 创建 Lexer
const lexer = new Lexer(allTokens);

class UpdateCellValueParser extends CstParser {
    constructor() {
        super(allTokens);

        this.RULE("sheetName", () => {
            const token = this.CONSUME(AlphaNumeric);
            return token.image; // 返回表名
        });

        this.RULE("cellCode", () => {
            this.CONSUME(LeftBracket);
            const number1 = this.CONSUME(Number).image; // 获取第一个数字
            this.CONSUME(Comma);
            const number2 = this.CONSUME2(Number).image; // 获取第二个数字
            this.CONSUME(RightBracket);
            return [number1, number2]; // 应返回单元格编号数组
        });

        // 在 UpdateCellValueParser 类中
        this.RULE("updateCellValue", () => {
            const sheetName = this.SUBRULE((this as any).sheetName);
            const cellCode = this.SUBRULE((this as any).cellCode);
            return { sheetName, cellCode };
        });

        this.performSelfAnalysis();
    }
}

//字段
/**
 * 
 * @param inputText 输入的内容
 * @param value 设置的值
 * @param fieldName 自定义字段  一般为value字段 字符串类型
 * @returns 
 */
export default function parseLeft(inputText: string, value: string = '1', fieldName: string = 'value') {
    const lexingResult = lexer.tokenize(inputText);
    if (lexingResult.errors.length > 0) {
        console.log(lexingResult)
        console.log(lexingResult.errors[0].message)
        if (lexingResult.errors[0].message.includes('unexpected character')) {
            throw new Error(`包含了未知字符"${extractCharacter(lexingResult.errors[0].message)}"`);
        } else {
            // Lexing errors detected"
            throw new Error("公式格式错误");
        }
    }

    const parser = new UpdateCellValueParser();
    parser.input = lexingResult.tokens;
    const cst = (parser as any).updateCellValue(); // 获取 CST 具体语法树

    if (parser.errors.length > 0) {
        console.error("解析错误检测到：");
        // 错误消息映射表
        const errorMessages: ErrorMessages = {
            "Expecting token of type --> AlphaNumeric": "解析错误：等号左边内容的表名必须是大小写字母开头加数字",
            "Expecting token of type --> LeftBracket <--": "解析错误：等号左边内容缺少左英文中括号符号 '['。",
            "Expecting token of type --> Number <-- but found --> '' <--": "解析错误：等号左边内容单元格编号格式异常,缺少数字内容",
            "Expecting token of type --> Comma <-- but found --> '' <--": "解析错误：等号左边内容单元格编号格式异常,缺少英文逗号符号','。",
            "Expecting token of type --> RightBracket <-- but found --> '' <--": "解析错误：等号左边内容缺少右英文中括号符号 ']'。",
            "Redundant input, expecting EOF but found:": "解析错误：等号左边内容异常，单元格编号右边出现了多余的输入"
        };
        parser.errors.forEach(error => {
            const customMessage = Object.keys(errorMessages).find(key => error.message.includes(key));
            const errorMessage = customMessage ? errorMessages[customMessage] : "解析错误：" + error.message;
            throw new Error(errorMessage);
        });

    }

    // 从 CST 提取 sheetName 和 cellCode
    const sheetName = cst.children.sheetName[0].children.AlphaNumeric[0].image;
    const cellNumbers = cst.children.cellCode[0].children.Number.map((numToken: { image: string; }) => numToken.image);
    const cellCode = `[${cellNumbers.join(',')}]`;

    // 构造 SQL 查询语句
    // const sqlQuery = `UPDATE ${sheetName} SET ${fieldName} = ${value} WHERE cellCode = '${cellCode}';`;
    return { sheetName, cellCode, };
}
