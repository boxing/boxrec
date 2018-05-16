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
    const camelCaseStr: string = str.replace(/\s(\w)/g, x => x[1].toUpperCase());
    return `${camelCaseStr.charAt(0).toLowerCase()}${camelCaseStr.slice(1)}`;
}

export function getColumnData($: CheerioAPI, nthChild: number, returnHTML: boolean = true): string {
    const el: Cheerio = $(`tr:nth-child(1) td:nth-child(${nthChild})`);

    if (returnHTML) {
        return el.html() || "";
    }

    return el.text();
}
