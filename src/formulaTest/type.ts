export interface ASTNode {
    type: string;
    value?: number;
    left?: ASTNode;
    right?: ASTNode;
}