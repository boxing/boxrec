import * as cheerio from 'cheerio';
import * as querystring from 'querystring';
import {ParsedUrlQuery} from 'querystring';
import {BoxingBoutOutcome} from './boxrec-pages/event/boxrec.event.constants';

/**
 * Converts fractional symbols into decimals
 * @param {string} fraction
 * @returns {number}
 */
export function convertFractionsToNumber(fraction: string): number {
    switch (fraction) {
        case '&#xBC;':
        case '¼':
            return .25;
        case '&#xBD;':
        case '½':
            return .5;
        case '&#xBE;':
        case '¾':
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
    return str.trim().replace(/(?:\r\n|\r|\n)/g, '').replace(/\s{2,}/g, ' ');
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
 * Takes CheerioStatic and tries to find column data by finding the table header index and then gets that columns data
 * Nice thing about this is that if the column number changes, the data will not fail and tests will pass
 * Don't throw errors inside otherwise it blows up when retrieving all data
 * @param $                 the cheerio static item that will have the "mock" fake table row
 * @param tableColumnsArr   contains the name of the table headers
 * @param columnHeaderText  the header text we are searching for, throws error if it cannot find it todo make type
 * @param returnHTML
 */
export function getColumnDataByColumnHeader($: CheerioStatic, tableColumnsArr: string[],
                                            columnHeaderText: BoxrecCommonTableHeader, returnHTML: boolean = true)
    : string {
    const tableEl: Cheerio = $($('<div>').append($('table').clone()).html());
    const idx: number = tableColumnsArr.findIndex(item => item === columnHeaderText);

    if (idx > -1) {
        const el: Cheerio = tableEl.find(`tr:nth-child(1) td:nth-child(${idx + 1})`);

        if (returnHTML) {
            const html: string | null = el.html();
            if (html) {
                return trimRemoveLineBreaks(html);
            }

            return '';
        }

        return trimRemoveLineBreaks(el.text());
    }

    return '';
}

/**
 * Common table header text that is used to quickly find data if the column number changes or the header name changes
 * synthetic headers don't actually exist but are used to classify a column as that type of data
 */
export enum BoxrecCommonTableHeader {
    age = 'age',
    career = 'career',
    date = 'date',
    day = 'day',
    debut = 'debut', // manager boxers
    division = 'division',
    fighter = 'fighter', // first boxer
    firstLast6 = 'firstLast6',
    firstFighterWeight = 'firstFighterWeight', // synthetic, no actual table header.  Is the first occurrence of "lbs"
    firstRating = 'firstRating', // synthetic, is the first fighter rating
    links = 'links', // synthetic, no actual table header
    location = 'location',
    miles = 'miles',
    name = 'name',
    outcome = 'outcome',
    opponent = 'opponent', // second boxer
    outcomeByWayOf = 'outcomeByWayOf', // synthetic, this is the outcome like TKO/KO/SD etc.
    points = 'points',
    rating = 'rating', // synthetic, no actual table header.  Is the rating of the bout/event
    residence = 'residence',
    result = 'result', // similar to outcome // todo can they be merged?
    rounds = 'rounds',
    secondLast6 = 'secondLast6',
    secondFighterWeight = 'secondFighterWeight', // synthetic, no actual table header. Is the second occurrence of "lbs"
    secondRating = 'secondRating', // synthetic, is the second fighter rating
    secondRecord = 'secondw-l-d', // on certain pages there are multiple records
    sport = 'sport',
    stance = 'stance',
    record = 'w-l-d',
    sex = 'sex',
    tick = 'tick', // this is purposeless column at this time, it shows whether a fight has occurred or not
    venue = 'venue'
}

export function getValueForHeadersArr(headersArr: string[],
                                      firstValue: BoxrecCommonTableHeader, secondValue: BoxrecCommonTableHeader):
any {
    const hasRecord: boolean = headersArr.some(item =>
        item === firstValue);

    if (hasRecord) {
        return secondValue;
    }

    return firstValue;
}

/**
 * Returns an array of all row data from a specific column
 * @param tableEl       the table element to check from
 * @param columnNumber  the column number to get the data
 * @param returnHTML    optionally return the full HTML of the column
 */
export function getTableColumnData(tableEl: Cheerio, columnNumber: number = 1, returnHTML: boolean = false): string[] {
    const arr: string[] = [];
    tableEl.clone().find(`> tbody tr`).each(function(this: CheerioElement, i, elem): void {
        const $: CheerioStatic = cheerio.load(elem);
        const tdColumn: Cheerio = $(this).find(`td:nth-child(${columnNumber})`);
        const data: string | null = returnHTML ? tdColumn.html() : tdColumn.text();
        if (data) {
            arr.push(trimRemoveLineBreaks(stripArrows(data)));
        }
    });

    return arr;
}

/**
 * Takes a table element and returns what the order of column headers and what each column is
 * @param tableEl
 * @param theadNumber   Some tables have more than 1 thead tag
 */
// todo complex
export function getHeaderColumnText(tableEl: Cheerio, theadNumber: number = 1): BoxrecCommonTableHeader[] {
    const headersArr: BoxrecCommonTableHeader[] = [];
    // we clone because it modifies the passed in element when we use map
    const tableHeaderRow: Cheerio = tableEl.clone().find(`> thead:nth-child(${theadNumber})`);

    tableHeaderRow
        .find('th')
        // tslint:disable-next-line
        .each(function(this: CheerioElement, i, elem): void {
            const $: CheerioStatic = cheerio.load(elem);
            // replace all non-alphanumeric characters so we don't include "sort arrows" from dataTables
            const headerText: string = trimRemoveLineBreaks(stripArrows($(this).text()));

            // some headers have "lbs" and "kilos" where the referee page just had "lbs"
            // todo maybe this should be more strict and check for symbols
            if (headerText.includes('lbs') || headerText.includes('kilos')) {
                headersArr.push(getValueForHeadersArr(headersArr,
                    BoxrecCommonTableHeader.firstFighterWeight, BoxrecCommonTableHeader.secondFighterWeight));
                return;
            }

            if (headerText === 'w-l-d') {
                headersArr.push(getValueForHeadersArr(headersArr,
                    BoxrecCommonTableHeader.record, BoxrecCommonTableHeader.secondRecord));
                return;
            }

            // some headings occur twice but we're expecting that, to differentiate what the column is
            // we give it a different label in our array
            if (headerText === 'last 6') {
                const hasFirstFighterLast6: boolean = headersArr.some(item =>
                    item === BoxrecCommonTableHeader.firstLast6);

                if (hasFirstFighterLast6) {
                    headersArr.push(BoxrecCommonTableHeader.secondLast6);
                } else {
                    headersArr.push(BoxrecCommonTableHeader.firstLast6);
                }
                return;
            }

            // so boxer profiles have "3" ratings.  The first fighter rating change, the second fighter rating change
            // and the rating of the bout.  The following tries to figure out if it's one of the first two
            if (headerText === 'rating') {
                const hasFirstRating: boolean = headersArr.some(item =>
                    item === BoxrecCommonTableHeader.firstRating);

                if (hasFirstRating) {
                    headersArr.push(BoxrecCommonTableHeader.secondRating);
                } else {
                    headersArr.push(BoxrecCommonTableHeader.firstRating);
                }

                return;
            }

            // some of the columns do not have table header text
            // therefore try to figure out what the column is
            if (headerText.length === 0) {
                // get the "direct" tbody cell element and read the cell contents to determine what the column is
                let tableColumns: Cheerio = tableHeaderRow.siblings('tbody').eq(0).find(`tr:nth-child(1) td`);

                // this has a pending approval or approval row and therefore we move to the next row to get the actual bout
                // the top bout row includes the "pending" row as well
                if (tableColumns.length === 1) {
                    tableColumns = tableHeaderRow.siblings('tbody').eq(0).find(`tr:nth-child(2) td`);
                }

                const tbodyColumnEl = tableColumns.eq(i);

                if (!tbodyColumnEl.length) {
                    throw new Error('Could not get table body element');
                }

                // check if rating column
                if (tbodyColumnEl.find('.star-icon').length || tbodyColumnEl.find('.fa-star').length) {
                    headersArr.push(BoxrecCommonTableHeader.rating);
                    return;
                }

                if (tbodyColumnEl.find('.tick').length) {
                    headersArr.push(BoxrecCommonTableHeader.tick);
                    return;
                }

                // check if is a column with links
                if (tbodyColumnEl.find('a[href*=\'/event/\']').length) {
                    headersArr.push(BoxrecCommonTableHeader.links);
                    return;
                }

                // check if outcome/results (W/L/D)
                if (tbodyColumnEl.find('.boutResult').length) {
                    headersArr.push(BoxrecCommonTableHeader.outcome);
                    return;
                }

                // check if location (on profiles, it doesn't have a location header text)
                if (tbodyColumnEl.find(locationFlagSelector).length) {
                    headersArr.push(BoxrecCommonTableHeader.location);
                    return;
                }

                // take the first rows data and get the text.  Some of the columns that don't have headers we can read the
                // text and proceed to figure out what the column is
                // todo this is not done right, it brings back too many values as one string
                const rowDataText: string = trimRemoveLineBreaks(tbodyColumnEl.text());

                if (rowDataText.length > 0 && !isNaN(rowDataText as unknown as number) ||
                    /[¼½¾]/.test(rowDataText)) {
                    headersArr.push(getValueForHeadersArr(headersArr,
                        BoxrecCommonTableHeader.firstFighterWeight, BoxrecCommonTableHeader.secondFighterWeight));
                    return;
                }

                if ($(`<div>${tbodyColumnEl.html()}</div>`).find('.personLink').length === 1) {
                    headersArr.push(getValueForHeadersArr(headersArr,
                        BoxrecCommonTableHeader.fighter, BoxrecCommonTableHeader.opponent));
                    return;
                }

                // as a last resort, if the header text is empty, we'll try to parse the row data and
                // see if we can figure out what column it is
                const tableDataRows: string[] = getTableColumnData(tableEl, i + 1);
                const uniqueVals: string[] = tableDataRows
                    .filter((elemItem: string, pos: number, arr: string[]) => arr.indexOf(elemItem) === pos);

                // test if is outcome
                const outcomeKeys: string[] = Object.keys(BoxingBoutOutcome);
                const numberOfOccurrences: number[] = uniqueVals.map(item =>
                    outcomeKeys.findIndex(k => k === item));

                if (numberOfOccurrences.length) {
                    const totalOccurrences: number = numberOfOccurrences.reduce((acc, curValue) => acc + curValue);

                    // check the total occurrences
                    if (totalOccurrences > 0) {
                        headersArr.push(BoxrecCommonTableHeader.outcomeByWayOf);
                        return;
                    }
                }
            }

            headersArr.push(headerText as BoxrecCommonTableHeader);
        });

    return headersArr;
}

export const locationFlagSelector = '*[class*="flag"]';

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
    = (str: string): string => str.replace(/,/g, '');

/**
 * Strips the dataTable arrows from table headers
 * @param str
 */
export const stripArrows: (str: string) => string
    = (str: string): string => str.replace(/[↕↓↑]/g, '');

export const whatTypeOfLink: (href: string) => 'town' | 'region' | 'country'
    = (href: string): 'town' | 'region' | 'country' => {
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
        return 'town';
    } else if (locationObj.country && locationObj.region) {
        return 'region';
    }

    return 'country';
};

export const getLocationValue: (href: string, type: 'town' | 'region' | 'country') => string | number | null =
    (href: string, type: 'town' | 'region' | 'country'): string | number | null => {
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
    (str: string) => trimRemoveLineBreaks(str).replace(/(\w+)\sTitle$/i, '$1weight Title');

export const parseHeight: (height: string | void) => number[] | null =
    (height: string | void): number[] | null => {
        if (height) {
            // helps simplify the regex
            // remove `&nbsp;`
            // height = height.replace(/&#xA0;/g, "");
            let regex: RegExp = /^(\d)\′\s(\d+)(½)?\″\s+\/\s+(\d{3})cm$/;

            if (height.includes('#x2032')) {
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
