/**
 * 判断字符串是否为空
 * @param {*} s 
 * @returns 非空字符串true，空字符串false
 */
export function isNotBlankStr(s) {
    if (s == undefined || s == null || s === '') {
        return false;
    }
    return true;
}


export function isValidURL(url: string): boolean {
    const urlRegex = /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
}