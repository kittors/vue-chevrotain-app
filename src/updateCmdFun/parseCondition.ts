import { splitStringByAnd } from '../utils/utils'
import { normalParse } from './normalJudgment'
import operatorsParsen from './operatorsParse'



const parseCondition = (str: string) => {

    if (str.includes('and')) {
        console.log('and运算', str)
        const newArr = splitStringByAnd(str)
        console.log(newArr)
        return {type:'andJudgment',children:  parseAndCondition(newArr)}
    } else if (str.includes('or')) {
        console.log('or运算', str)
    }
}

//普通判断 截取

const parseAndCondition = (newArr: string[]) => {
    let arr: any[] = []
    newArr.forEach(item => {
        if (item.includes('R$')) {
            const obj = { type: 'RightCharCut', ...operatorsParsen(item) }
            arr.push(obj)
        } else if (item.includes('L$')) {
            const obj = { type: 'leftCharCut', ...operatorsParsen(item) }
            arr.push(obj)
        } else {
            const obj = { type: 'normal', ...normalParse(item) }
            arr.push(obj)
        }
    })
    return arr
}


export default parseCondition 