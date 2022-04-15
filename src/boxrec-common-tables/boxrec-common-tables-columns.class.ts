import * as cheerio from "cheerio";
import * as querystring from "querystring";
import {BoxrecBasic, BoxrecJudge, BoxrecLocation, Record, WinLossDraw} from "../boxrec-pages/boxrec.constants";
import {WeightDivision} from "../boxrec-pages/champions/boxrec.champions.constants";
import {BoxingBoutOutcome, BoxingBoutOutcomeKeys} from "../boxrec-pages/event/boxrec.event.constants";
import {convertFractionsToNumber, replaceWithWeight, trimRemoveLineBreaks, whatTypeOfLink} from "../helpers";
import {BoxrecTitles} from "./boxrec-common.constants";

const $: CheerioStatic = cheerio.load("<div></div>");

/**
 * Used to parse common columns
 */
export abstract class BoxrecCommonTablesColumnsClass {

    /**
     * @hidden
     */
    static parseAlias(htmlString: string): string | null {
        if (htmlString) {
            return trimRemoveLineBreaks(htmlString);
        }

        return null;
    }

    /**
     * @hidden
     */
    static parseCareer(htmlString: string): Array<number | null> {
        const careerMatches: RegExpMatchArray | null = htmlString.match(/(\d{4})-(\d{4})/);
        if (careerMatches && careerMatches.length === 3) {
            return [parseInt(careerMatches[1], 10), parseInt(careerMatches[2], 10)];
        }
        return [null, null];
    }

    /**
     * Current and hopefully future proofing the name of the division to keep consistent
     * the value can be missing
     * @param htmlString   a (possibly) shortened version of weight divisions ex. light heavyweight -> light heavy
     * @return the weight division as a WeightDivision value otherwise we return the found value
     */
    static parseDivision(htmlString: string): WeightDivision | null {
        const cleanedDivision: string = trimRemoveLineBreaks(htmlString.toLowerCase());
        const withWeight: string = !/weight$/.test(cleanedDivision)
            ? `${cleanedDivision}weight` : cleanedDivision;
        const fullWeightDivision: WeightDivision | undefined = Object.values(WeightDivision)
            .find(item => item === withWeight);

        if (fullWeightDivision) {
            return fullWeightDivision;
        }

        return null;
    }

    static parseId(htmlString: string): number | null {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        const href: string = html.find("a").attr("href");

        if (href) {
            const matches: RegExpMatchArray | null = href.match(/(\d+)$/);

            if (matches && matches[1]) {
                return parseInt(matches[1], 10);
            }
        }

        return null;
    }

    /**
     * @hidden
     */
    static parseJudges(htmlString: string): BoxrecJudge[] {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        const judges: BoxrecJudge[] = [];

        html.find("a").each((index: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const matches: RegExpMatchArray | null = href.match(/judge\/(\d+)$/);

            if (matches && matches[1]) {
                const {id, name} = BoxrecCommonTablesColumnsClass.parseIdAndName(elem, matches);
                const scoreCardRegex: RegExp = /<\/a>\s(\d{1,3})-(\d{1,3})/g;
                const scorecard: number[] = [];

                let m: RegExpExecArray | null;
                let i: number = 0;
                do {
                    m = scoreCardRegex.exec(htmlString);
                    if (m && m[1] && m[2]) {
                        if (i === judges.length) {
                            scorecard.push(parseInt(m[1], 10), parseInt(m[2], 10));
                        }
                    }
                    i++;
                } while (m);

                judges.push({
                    id, name, scorecard,
                });
            }
        });

        return judges;
    }

    static parseLast6Column(htmlString: string): WinLossDraw[] {
        const last6: WinLossDraw[] = [];
        $(htmlString).find("div.last6").each((i: number, elem: CheerioElement) => {
            const className: string = elem.attribs.class;
            if (className.includes("bgW")) {
                last6.push(WinLossDraw.win);
            } else if (className.includes("bgD")) {
                last6.push(WinLossDraw.draw);
            } else if (className.includes("bgL")) {
                last6.push(WinLossDraw.loss);
            } else {
                last6.push(WinLossDraw.unknown);
            }
        });

        return last6;
    }

    /**
     * Can parse the id, town, region, country from multiple links
     * @param {string} htmlString   passed in HTML string, more than likely the contents of an HTML table column
     * @param {number} linkToLookAt Sometimes the format is `town, region, country`.
     *                              Other times it is `country, region, town`
     * @hidden
     * @returns {BoxrecLocation}
     */
    static parseLocationLink(htmlString: string, linkToLookAt: number = 0): BoxrecLocation {
        const location: BoxrecLocation = {
            country: {
                id: null,
                name: null,
            },
            region: {
                id: null,
                name: null,
            },
            town: {
                id: null,
                name: null,
            },
        };
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        const links: Cheerio = html.find("a");

        links.each((index: number, elem: CheerioElement) => {
            // /en/locations/event?country=US&region=NY&town=20451
            const href: string = $(elem).attr("href");
            const text: string = $(elem).text();
            const whatTypeOfLinkResult: "town" | "region" | "country" = whatTypeOfLink(href);
            const matchQSKeyVals: RegExpMatchArray | null = href.match(/(\w+)\=(\w+)/g);

            if (matchQSKeyVals) {
                const idParsed: string | number = matchQSKeyVals
                    .map(item => querystring.parse(item))
                    .filter(item => Object.keys(item)[0] === whatTypeOfLinkResult)
                    .map(item => {
                        const val: string = Object.values(item)[0] as string;
                        const testValIfNumber: number = parseInt(val, 10);

                        if (isNaN(testValIfNumber)) {
                            return val;
                        }

                        return testValIfNumber;
                    })[0];
                location[whatTypeOfLinkResult] = {
                    id: idParsed,
                    name: text,
                };
            }
        });

        return location;
    }

    static parseName(htmlString: string): string {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        let name: string = html.text();
        name = trimRemoveLineBreaks(name);

        if (name.slice(-1) === "*") {
            name = name.slice(0, -1);
        }

        return name;
    }

    /**
     * @hidden
     */
    static parseNameAndId(htmlString: string): BoxrecBasic {
        if (trimRemoveLineBreaks(htmlString) !== "TBA") {
            const html: Cheerio = $(`<div>${htmlString}</div>`);
            const href: string = html.find("a").attr("href");
            const regex: RegExp = /(\d+)$/;
            if (href) {
                const matches: RegExpMatchArray | null = href.match(regex);

                if (matches && matches[1]) {
                    return {
                        id: parseInt(matches[1], 10),
                        name: html.find("a").text(),
                    };
                }
            }
        }

        return {
            id: null,
            name: null,
        };
    }

    /**
     * @hidden
     */
    static parseNumberOfRounds(htmlString: string): Array<number | null> {
        let numberOfRounds: Array<number | null> = [null, null];
        const splitRounds: string[] = htmlString.trim().split("/");
        const formattedSplitRounds: number[] = splitRounds.map(item => parseInt(item, 10));
        if (formattedSplitRounds.length === 2) {
            numberOfRounds = formattedSplitRounds;
        } else if (formattedSplitRounds.length === 1 && !isNaN(formattedSplitRounds[0])) {
            numberOfRounds = [null, formattedSplitRounds[0]];
        }

        return numberOfRounds;
    }

    /**
     * @hidden
     */
    static parseOutcome(htmlString: string): WinLossDraw {
        let outcome: string = htmlString;
        outcome = outcome.trim();
        switch (outcome) {
            case "W":
                return WinLossDraw.win;
            case "D":
                return WinLossDraw.draw;
            case "L":
                return WinLossDraw.loss;
            case "S":
                return WinLossDraw.scheduled;
            default:
                return WinLossDraw.unknown;
        }
    }

    /**
     * @hidden
     */
    static parseOutcomeByWayOf(htmlString: string, parseText: boolean = false): BoxingBoutOutcome | string | null {
        if (trimRemoveLineBreaks(htmlString)) {
            const html: Cheerio = $(`<div>${htmlString}</div>`);
            html.find("div").remove();
            let outcomeByWayOf: string = html.text();
            outcomeByWayOf = outcomeByWayOf.trim();

            if (parseText) {
                return BoxingBoutOutcome[outcomeByWayOf as BoxingBoutOutcomeKeys];
            }

            return outcomeByWayOf;
        }

        return null;
    }

    static parseRating(htmlString: string, fullStarClassName: string, halfStarClassName: string): number | null {
        const html: Cheerio = $(htmlString);
        const fullStarRating: Cheerio = html.find(fullStarClassName);
        const halfStarRating: Cheerio = html.find(halfStarClassName);

        return (fullStarRating.length * 20) + (halfStarRating.length * 10);
    }

    static parseRecord(htmlString: string): Record {
        const record: Record = {
            draw: null,
            loss: null,
            win: null,
        };
        const html: Cheerio = $(`<div>${htmlString}</div>`);

        if (html.find(".textWon").length && !htmlString.includes("debut")) { // has fought/or fighter picked
            record.win = parseInt(html.find(".textWon").text(), 10);
            record.loss = parseInt(html.find(".textLost").text(), 10);
            record.draw = parseInt(html.find(".textDraw").text(), 10);
        } else if (htmlString.includes("debut")) {
            record.win = 0;
            record.loss = 0;
            record.draw = 0;
        }

        return record;
    }

    /**
     * @hidden
     */
    static parseReferee(htmlString: string): BoxrecBasic {
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        let referee: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find("a").each((index: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const matches: RegExpMatchArray | null = href.match(/referee\/(\d+)$/);

            if (matches && matches[1]) {
                referee = BoxrecCommonTablesColumnsClass.parseIdAndName(elem, matches);
            }
        });

        return referee;
    }

    /**
     * todo parse if `vacant` or not (is in name)
     * BoxRec currently returns belts in order of ID ASC.  If that changes, add custom sorting logic here
     * @hidden
     */
    static parseTitles(htmlString: string): BoxrecTitles[] {
        const titles: BoxrecTitles[] = [];
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        let titleIndexAt: number = 0;

        html.find("a").each((index: number, elem: CheerioElement) => {
            const {class: className, href} = $(elem).get(0).attribs;

            if (className && className.includes("titleLink")) {
                const matches: RegExpMatchArray | null = href.match(/(\d+\/[\w%]+)$/);

                if (matches && matches[1]) {
                    const id: string = matches[1];
                    let name: string = $(elem).text();
                    name = replaceWithWeight(name);

                    titles.push({
                        id, name,
                    });
                    titleIndexAt = titles.length - 1;
                }
            } else if (href.includes("supervisor")) {
                const matches: RegExpMatchArray | null = href.match(/\d+$/);

                if (matches) {
                    titles[titleIndexAt].supervisor = {
                        id: parseInt(matches[0], 10),
                        name: replaceWithWeight($(elem).text()),
                    };
                }
            }
        });

        return titles;
    }

    /**
     * @hidden
     */
    static parseWeight(htmlString: string): number | null {
        const weight: string = htmlString.trim();
        let formattedWeight: number | null = null;

        if (weight.length) {
            formattedWeight = parseInt(weight, 10);

            if (isNaN(parseInt(weight.slice(-1), 10))) {
                formattedWeight += convertFractionsToNumber(weight.slice(-1));
            }
        }

        return formattedWeight;
    }

    private static parseIdAndName(elem: CheerioElement, matches: RegExpMatchArray): BoxrecBasic {
        const id: number = parseInt(matches[1], 10);
        let name: string = $(elem).text();
        name = trimRemoveLineBreaks(name);

        return {
            id,
            name,
        };
    }

}
