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
 * @returns {string}
 */
export function getColumnData($: CheerioStatic, nthChild: number, returnHTML: boolean = true): string {
    const el: Cheerio = $(`tr:nth-child(1) td:nth-child(${nthChild})`);

    if (returnHTML) {
        return el.html() || "";
    }

    return el.text();
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
