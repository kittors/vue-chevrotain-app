import parseRight from "./rightParse.ts";
import { splitStringByFirstEqual } from "../utils/utils.ts";
import parseCondition from "./parseCondition.ts";
import parseLeft from "./leftParse.ts";

interface FunBaseStruc {
    rightPart: string;
    leftPart: string;
}
export default function parseFun(str: string) {

    const reusult = splitStringByFirstEqual(str);
    //初步解析
    const { leftPart, rightPart } = reusult as FunBaseStruc;

    // console.log(leftPart, rightPart);
    // 解析右边的结果
    const analysisRightResult = parseRight(rightPart);
    const rightObj = {
        type: "rightPart",
        ...analysisRightResult,
        children: { ...parseCondition(analysisRightResult.condition) },
    };
    // console.log(parseLeft(leftPart));
    const leftObj = {
        type: "leftPart",
        ...parseLeft(leftPart),
    };
    const resultObj = {
        type: "updateDate",
        children: {
            ...leftObj,
            ...rightObj,
        },
    };
    console.log(resultObj)
    return resultObj
}