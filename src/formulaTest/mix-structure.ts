import {CstParser} from 'chevrotain'
import {Number, String, NumberTable, LogoTable} from "./tokens";

const allTokens = [Number, String, NumberTable, LogoTable]

// MixStructure 类定义
export class MixStructure extends CstParser {
    constructor() {
        super(allTokens);
    }

    public MixStructureExpression = this.RULE('MixStructureExpression', () => {
        this.OR([
            {ALT: () => this.CONSUME(Number)},
            {ALT: () => this.CONSUME(String)},
            {ALT: () => this.CONSUME(NumberTable)},
            {ALT: () => this.CONSUME(LogoTable)}
        ]);
    });
}