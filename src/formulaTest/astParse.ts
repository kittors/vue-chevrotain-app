import {parser} from "./cstToParse";

// 使用createVisitor工厂函数基于parser的规则来创建一个访问者基类
const BaseVisitor = parser.getBaseCstVisitorConstructor();

interface astNodeType {
    type?: string,
    left?: any,
    right?: any,
    option?: string
}

// 创建一个自定义访问者类来继承基类
class AstParse extends BaseVisitor {
    constructor() {
        super();
        console.log(this)
        // 确保访问者方法的绑定正确
        this.validateVisitor();
    }

    expression(ctx: any) {
        return this.visit(ctx.conditionalExpression);
    }

    conditionalExpression(ctx: any) {
        if (ctx.ifThenElseExpression) {
            return this.visit(ctx.ifThenElseExpression)
        }
        return this.visit(ctx.orExpression)
    }

    ifThenElseExpression(ctx: any) {
        return {
            type: 'IfThenElseExpression',
            if: this.visit(ctx.ifExpression),
            then:  this.visit(ctx.thenExpression),
            else: ctx.elseExpression?this.visit(ctx.elseExpression):null
        };
    }

    ifExpression(ctx: any) {
        return this.visit(ctx.orExpression)
    }

    thenExpression(ctx: any) {
        return this.visit(ctx.orExpression)
    }

    elseExpression(ctx: any) {
        return this.visit(ctx.orExpression)
    }

    orExpression(ctx: any) {
        if (this.getObjectKeyLength(ctx) === 1) {
            return this.visit(ctx.andExpression)
        }
        let orArr = ctx.andExpression.map((item: any) => {
            return this.visit(item)
        })
        let options: any[] = []
        options = options.concat(ctx.OR).map(()=>"OR")
        return this.arrayToNestedObject(orArr.reverse(), options.reverse())
    }

    andExpression(ctx: any) {
        if (this.getObjectKeyLength(ctx) === 1) {
            return this.visit(ctx.comparisonExpression)
        }
        let andArr = ctx.comparisonExpression.map((item: any) => {
            return this.visit(item)
        })
        let options: any[] = []
        options = options.concat(ctx.AND).map(()=>"AND")
        return this.arrayToNestedObject(andArr.reverse(), options.reverse())
    }
    //处理判断
    comparisonExpression(ctx: any) {
        if (this.getObjectKeyLength(ctx) === 1) {
            return this.visit(ctx.plusOrMinExpression)
        }
        const condition = {
            left: this.visit(ctx.plusOrMinExpression[0]),
            right: this.visit(ctx.plusOrMinExpression[1]),
            option: ctx.GreaterOrEqual && ctx.GreaterOrEqual[0].image
                || ctx.LessOrEqual && ctx.LessOrEqual[0].image
                || ctx.Greater && ctx.Greater[0].image
                || ctx.Less && ctx.Less[0].image
                || ctx.NotEqual && ctx.NotEqual[0].image
                || ctx.Equals && ctx.Equals[0].image,
            type: ctx?.Equals ? "Equals" : 'comparisonExpression'
        }
        if(ctx.NOT){
            if(ctx.NOT.length%2===1){
                return {
                    type: "notExpression",
                    value: condition
                }
            }else{
                return {
                    type: "notExpression",
                    value: {
                        type: "notExpression",
                        value: condition
                    }
                }
            }
        }
        return condition
    }
    //处理加减
    plusOrMinExpression(ctx: any) {
        if (this.getObjectKeyLength(ctx) === 1) {
            return this.visit(ctx.multiplyOrDivExpression)
        }
        let mixStructureArr = ctx.multiplyOrDivExpression.map((item: any) => {
            return this.visit(item)
        })
        let options: any[] = []
        ctx.Minus ? options = options.concat(ctx.Minus) : ''
        ctx.Plus ? options = options.concat(ctx.Plus) : ''
        // 按照startColumn排序插入相应位置
        options = options.sort((x, y) => x.startColumn - y.startColumn).map(item => item.image)
        // 将同级别乘除转成树结构 使用reverse反转 实现最小节点计算可以从左向右
        return this.arrayToNestedObject(mixStructureArr.reverse(), options.reverse())

    }
    // 处理乘除
    multiplyOrDivExpression(ctx: any) {
        if (this.getObjectKeyLength(ctx) === 1) {
            return this.visit(ctx.atomicExpression)
        }
        let mixStructureArr = ctx.atomicExpression.map((item: any) => {
            return this.visit(item)
        })
        let options: any[] = []
        ctx.Multiply ? options = options.concat(ctx.Multiply) : ''
        ctx.Divide ? options = options.concat(ctx.Divide) : ''
        // 按照startColumn排序插入相应位置
        options = options.sort((x, y) => x.startColumn - y.startColumn).map(item => item.image)
        // 将同级别乘除转成树结构 使用reverse反转 实现最小节点计算可以从左向右
        return this.arrayToNestedObject(mixStructureArr.reverse(), options.reverse())

    }
    // 对带括号的或者最小结构处理
    atomicExpression(ctx: any) {
        if (this.getObjectKeyLength(ctx) === 1) {
            return this.visit(ctx.MixStructureExpression)
        } else {
            return this.visit(ctx.orExpression)
        }
    }
    // 最小结构处理
    MixStructureExpression(ctx: any) {
        let astNode;
        switch (Object.keys(ctx)[0]) {
            case 'Number':
                astNode = ctx.Number[0].image;
                break;
            case 'String':
                astNode = ctx.String[0].image
                break;
            case 'table':
                astNode = this.visit(ctx.table)
                break;
            case 'sumFunction':
                astNode = this.visit(ctx.sumFunction)
                break;
        }
        return astNode
    }
    // 对表格进行处理 返回表名 单元格 标识 条件
    table(ctx: any) {
        return {
            tableName: ctx.TableName[0].image,
            tableCell: this.visit(ctx.cellExpression).cell,
            type: this.visit(ctx.cellExpression).type,
            condition: ctx.Condition?(ctx.orExpression?this.visit(ctx.orExpression):''):null
        }
    }
    // 对表格编号 标识 处理
    cellExpression(ctx: any) {
        if(ctx.numberCellExpression){
            return {
                type: "numberCellExpression",
                cell: this.visit(ctx.numberCellExpression),
            }
        }
        return {
            type: "identifyingCellExpression",
            cell: this.visit(ctx.identifyingCellExpression),
        }
    }
    // 返回数字单元格
    numberCellExpression(ctx: any) {
        return [ctx.Number[0].image,ctx.Number[1].image]
    }
    // 返回标识
    identifyingCellExpression(ctx: any) {
        return [ctx.Identifying[0].image]
    }

    // 对sum函数处理 直接转成加法操作
    sumFunction(ctx: any) {
        let arr: any[] = []
        const table = ctx.table?.map((item: any) => {
            return this.visit(item)
        })||[]
        let options: any[] = []
        ctx.Number ? arr = arr.concat(ctx.Number).map(item=>item.image).concat(table) : ''
        for (let i = 1; i < arr.length; i++) {
            options.push("+")
        }
        return this.arrayToNestedObject(arr.reverse(), options.reverse())
    }

    //处理many生成扁平化数据 生成固定树结构
    private arrayToNestedObject(arr: any[], option: Array<"+" | "-" | "*" | "/" | "AND" | "OR">) {
        // 初始化当前节点
        let currentNode: astNodeType = {};
        let type = '';
        switch (option[0]) {
            case "+":
                type = "plusExpression";
                break;
            case "-":
                type = "minusExpression";
                break;
            case "*":
                type = "multiplyExpression";
                break;
            case "/":
                type = "divExpression";
                break;
            case 'AND':
                type = "andExpression";
                break;
            case 'OR':
                type = "orExpression";
                break;
        }
        // 递归地构建右侧值
        if (arr.length > 1) {
            // 取数组的第一个元素作为左侧值
            currentNode.right = arr[0];
            currentNode.option = option[0]
            currentNode.type = type
            currentNode.left = this.arrayToNestedObject(arr.slice(1), option.slice(1));
        } else {
            return arr[0]
        }

        return currentNode;
    }

    private getObjectKeyLength(obj: object) {
        return Object.keys(obj).length
    }

}

// 创建访问者实例
export const astBuilder = new AstParse();