//按照首个等号进行拆分 左右两个部分
function splitStringByFirstEqual(input: string): { leftPart: string, rightPart: string } | string | { error: string } {
    // 检查是否包含不区分大小写的 'IF'
    if (/if/i.test(input) || /then/i.test(input)) {
        return 'conditionParse';
    }

    //对一个大结构判断是否有等号
    const equalIndex = input.indexOf('=');
    if (equalIndex === -1) {
        // No '=' character found
        return { error: '缺少“=”关键字' }
    }

    const leftPart = input.substring(0, equalIndex)
    const rightPart = input.substring(equalIndex + 1)

    // 检查等号前后是否含有 >< = ! 这些字符
    if (/[><=!]/.test(leftPart.slice(-1))) {
        return { error: '等号前不允许带有“><=!”的关键字' };
    }

    if (/[><=!]/.test(rightPart.charAt(0))) {
        return { error: '等号后不允许带有“><=!”的关键字' };
    }
    return { leftPart, rightPart }
}

function parseIfThenElse(input: string): { type: string, IF: string, THEN: string, ELSE?: string } | null | { error: string } {
    input = input.trim(); // 去除首尾空白

    // 使用正则表达式来寻找 IF, THEN, ELSE 关键字（不区分大小写）
    const ifRegex = /\bIF\b/i;
    const thenRegex = /\bTHEN\b/i;
    const elseRegex = /\bELSE\b/i;

    // 检查是否有 IF 和 THEN 关键字
    const ifIndex = input.search(ifRegex);
    const thenIndex = input.search(thenRegex);
    const elseIndex = input.search(elseRegex);

    // 如果没有 IF 或 THEN 关键字，则返回 null
    if (ifIndex === -1 || thenIndex === -1) {
        if (ifIndex === 0) {

            return { error: '缺少THEN关键字，IF语句必须包含THEN' }
        } else if (thenIndex === 0) {
            return { error: '缺少IF关键字，THEN执行需要拥有条件IF' }
        }
        return null
    }

    // 提取 IF 和 THEN 之间的部分
    const ifPart = input.slice(ifIndex + 2, thenIndex).trim();

    let thenPart = "";
    let elsePart = "";

    if (elseIndex !== -1) {
        // 如果存在 ELSE 关键字
        thenPart = input.slice(thenIndex + 4, elseIndex).trim();
        elsePart = input.slice(elseIndex + 4).trim();
        return { type: "IFTHENELSE", IF: ifPart, THEN: thenPart, ELSE: elsePart };
    } else {
        // 如果不存在 ELSE 关键字
        thenPart = input.slice(thenIndex + 4).trim();
        return { type: "IFTHEN", IF: ifPart, THEN: thenPart };
    }
}

export { splitStringByFirstEqual, parseIfThenElse }