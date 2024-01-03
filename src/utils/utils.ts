//按照首个等号进行拆分 左右两个部分
function splitStringByFirstEqual(input: string): { leftPart: string, rightPart: string } | null {
    console.log(input)
    const equalIndex = input.indexOf('=');
    if (equalIndex === -1) {
        // No '=' character found
        throw new Error('啥玩意哦，没有等号');
    }

    return {
        leftPart: input.substring(0, equalIndex),
        rightPart: input.substring(equalIndex + 1)
    };
}

//按照and 进行拆分成数组
function splitStringByAnd(input: string): string[] {
    return input.split(/\band\b/).map(s => s.trim());
}

//查找/-> 和 <-/中的值
function extractCharacter(str: string): string | null {
    const regex = /->(.*?)<-/;
    const match = regex.exec(str);
    return match ? match[1] : null;
}

//顺序执行队列 函数从左向右依次执行
function executeSequentially(tasks: Array<() => Promise<any>>): Promise<void> {
    return tasks.reduce((promiseChain, currentTask) => {
        return promiseChain.then(currentTask);
    }, Promise.resolve());
}

export { splitStringByFirstEqual, splitStringByAnd, extractCharacter, executeSequentially }