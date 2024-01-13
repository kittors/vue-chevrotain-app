// ast.ts
export interface Expression {}

export class BinaryExpression implements Expression {
    constructor(
        public left: Expression,
        public operator: string,
        public right: Expression
    ) {}
}

export class NumericLiteral implements Expression {
    constructor(public value: number) {}
}
