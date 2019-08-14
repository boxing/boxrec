import * as cheerio from "cheerio";
import * as querystring from "querystring";
import {ParsedUrlQuery} from "querystring";

/**
 * Converts fractional symbols into decimals
 * @param {string} fraction
 * @returns {number}
 */
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

/**
 * Removes whitespace at the start and end of the string, remove line breaks and removes occurrences where multiple spaces occur
 * @param {string} str
 * @returns {string}
 */
export function trimRemoveLineBreaks(str: string): string {
    return str.trim().replace(/(?:\r\n|\r|\n)/g, "").replace(/\s{2,}/g, " ");
}

/**
 * Changes a string to camelCase
 * @param {string} str
 * @example "foo bar" becomes "fooBar"
 * @returns {string}
 */
export function changeToCamelCase(str: string): string {
    const camelCaseStr: string = str.replace(/\s(\w)/g, x => x[1].toUpperCase());
    return `${camelCaseStr.charAt(0).toLowerCase()}${camelCaseStr.slice(1)}`;
}

/**
 * Used to retrieve data from individual table columns
 * @param {CheerioAPI} $        requires that the CheerioApi object be passed in
 * @param {number} nthChild     the column number starting at 1
 * @param {boolean} returnHTML  if true, the HTML will be returned, otherwise just text with HTML removed
 * @deprecated  can slowly be removed from a lot of classes, should try to use `getColumnDataByColumnHeader`.
 *              Not high priority
 * @returns {string}
 */
export function getColumnData($: CheerioStatic, nthChild: number, returnHTML: boolean = true): string {
    const el: Cheerio = $(`tr:nth-child(1) td:nth-child(${nthChild})`);

    if (returnHTML) {
        return el.html() || "";
    }

    return el.text();
}

/**
 * Takes CheerioStatic and tries to find column data by finding the table header index and then gets that columns data
 * Nice thing about this is that if the column number changes, the data will not fail and tests will pass
 * @param $                 the cheerio static item that will have the "mock" fake table row
 * @param tableColumnsArr   contains the name of the table headers
 * @param columnHeaderText  the header text we are searching for, throws error if it cannot find it todo make type
 * @param returnHTML
 */
export function getColumnDataByColumnHeader($: CheerioStatic, tableColumnsArr: string[], columnHeaderText: string,
                                            returnHTML: boolean = true)
    : string {
    const tableEl: Cheerio = $($("<div>").append($("table").clone()).html());
    const idx: number = tableColumnsArr.findIndex(item => item === columnHeaderText);

    if (idx === -1) {
        throw new Error(`Could not find the column header in the array: ${tableColumnsArr}, ${columnHeaderText}`);
    }
    const el: Cheerio = tableEl.find(`tr:nth-child(1) td:nth-child(${idx + 1})`);

    if (!el.length) {
        throw new Error(`Tried to get column data for column that doesn't exist,
         but existed in array?: ${columnHeaderText}`);
    }

    if (returnHTML) {
        const html: string | null = el.html();
        if (html) {
            return trimRemoveLineBreaks(html);
        }

        return "";
    }

    return trimRemoveLineBreaks(el.text());
}

/**
 * Takes a table element, clones it and then reads the thead column text and returns an array
 * @param tableEl
 */
export function getHeaderColumnText(tableEl: Cheerio): string[] {
    // we clone because it modifies the passed in element when we use map
    return tableEl.clone().find("thead th")
        .map((i: number, elem: CheerioElement) => {
            const elemEl: any = cheerio.load(elem) as CheerioStatic;
            let text: string = trimRemoveLineBreaks(elemEl.text());

            // some of the columns do not have table header text
            // therefore try to figure out what the column is
            if (text.length === 0) {
                // get the tbody column element for further analysing
                const tbodyColumn: Cheerio = tableEl
                    .find(`tbody tr:nth-child(1) td:nth-child(${i + 1})`);

                // check if rating column
                if (tbodyColumn.find(".starRating").length) {
                    text = "rating";
                }
            }

            return text;
        }).get();
}

// the following regex assumes the string is always in the same format
// `region` and `town` are wrapped with a conditional statement
// in some instances the URL just contains ex. `?country=US`
// `region` can be numeric but is often alphanumeric
export const townRegionCountryRegex: RegExp =
    /\?country=([A-Za-z]+)(?:(?:&|&amp;)region=([A-Za-z0-9]*))?(?:(?:&|&amp;)town=(\d+))?/;

/**
 * Strips the commas out of a string.  Used for strings that are large numbers
 * @param {string} str
 * @returns {string}
 */
export const stripCommas: (str: string) => string
    = (str: string): string => str.replace(/,/g, "");

export const whatTypeOfLink: (href: string) => "town" | "region" | "country"
    = (href: string): "town" | "region" | "country" => {
    const matches: RegExpMatchArray | null = href.match(/(\w+)\=(\w+)/g);
    const locationObj: any = {
        country: null,
        region: null,
        town: null,
    };

    if (matches) {
        for (const match of matches) {
            const splitQuery: ParsedUrlQuery = querystring.parse(match);
            const arr: string[] = Object.keys(splitQuery).map(x => [x, splitQuery[x]])[0] as any;
            locationObj[arr[0]] = arr[1];
        }
    }

    if (locationObj.country && locationObj.region && locationObj.town) {
        return "town";
    } else if (locationObj.country && locationObj.region) {
        return "region";
    }

    return "country";
};

export const getLocationValue: (href: string, type: "town" | "region" | "country") => string | number | null =
    (href: string, type: "town" | "region" | "country"): string | number | null => {
        const matches: RegExpMatchArray | null = href.match(/(\w+)=(\w+)/g);
        if (matches) {
            for (const match of matches) {
                const splitQuery: ParsedUrlQuery = querystring.parse(match);
                const keys: string[] = Object.keys(splitQuery);

                if (keys[0] === type) {
                    return splitQuery[keys[0]] as any;
                }
            }
        }

        return null;
    };

// replaces short division with full ex. Middle Title -> Middleweight Title
// ex. World Boxing Council World Middle Title -> World Boxing Council World Middleweight Title
export const replaceWithWeight: (str: string) => string =
    (str: string) => trimRemoveLineBreaks(str).replace(/(\w+)\sTitle$/i, "$1weight Title");

export const parseHeight: (height: string | void) => number[] | null =
    (height: string | void): number[] | null => {
        if (height) {
            // helps simplify the regex
            // remove `&nbsp;`
            // height = height.replace(/&#xA0;/g, "");
            let regex: RegExp = /^(\d)\′\s(\d+)(½)?\″\s+\/\s+(\d{3})cm$/;

            if (height.includes("#x2032")) {
                regex = /^(\d)\&\#x2032\;\s(\d{1,2})(\&\#xB[CDE]\;)?\&\#x2033\;\s\&\#xA0\;\s\/\s\&\#xA0\;\s(\d{3})cm$/;
            }

            const heightMatch: RegExpMatchArray | null = height.match(regex);

            if (heightMatch) {
                const [, imperialFeet, imperialInches, fractionInches, metric] = heightMatch;
                let formattedImperialInches: number = parseInt(imperialInches, 10);
                formattedImperialInches += convertFractionsToNumber(fractionInches);

                return [
                    parseInt(imperialFeet, 10),
                    formattedImperialInches,
                    parseInt(metric, 10),
                ];
            }
        }

        return null;
    };
