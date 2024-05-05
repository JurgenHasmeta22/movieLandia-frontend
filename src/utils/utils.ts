export function toFirstWordUpperCase(str: string) {
    if (str) {
        const strFinal = str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
                return index === 0 ? letter.toUpperCase() : letter.toLowerCase();
            })
            .replace(/\s+/g, "");

        return strFinal;
    } else {
        return "";
    }
}

export function toCamelCase(str: string) {
    console.log(str);
    if (str) {
        const strFinal = str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
                return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
            })
            .replace(/\s+/g, "")
            .replace(/^[A-Z]/, (match) => match.toLowerCase());

        console.log(strFinal);
        return strFinal;
    } else {
        return "";
    }
}
