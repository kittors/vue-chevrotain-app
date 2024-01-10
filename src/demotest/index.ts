
import baseParse from './parseModel/baseParse'

export default function parseBase(str: string) {
    console.log('输入的内容', str)
    try {
        const cst = baseParse(str)
        console.log(cst)
    } catch (error) {
        console.log(error)
    }
}
