export function convertFractionsToNumber(fraction: string): number {
    switch (fraction) {
        case "&#xBC;":
        case "¼":
            return .25;
        case "&#xBD;":
        case "½":
            return .5;
        case "&#xBE;":
        case "¾":
            return .75;
        default:
            return 0;
    }
}

export function trimRemoveLineBreaks(str: string): string {
    return str.trim().replace(/(?:\r\n|\r|\n)/g, "").replace(/\s{2,}/, " ");
}

export function changeToCamelCase(str: string): string {
    str = str.replace(/\s(\w)/g, x => x[1].toUpperCase());
    str = `${str.charAt(0).toLowerCase()}${str.slice(1)}`;
    return str;
}
