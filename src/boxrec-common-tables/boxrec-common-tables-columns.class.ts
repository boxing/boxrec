import {convertFractionsToNumber, townRegionCountryRegex, trimRemoveLineBreaks} from "../helpers";
import {BoxrecBasic, BoxrecJudge, Location, Record, WinLossDraw} from "../boxrec-pages/boxrec.constants";
import {WeightDivision} from "../boxrec-pages/champions/boxrec.champions.constants";
import {BoxingBoutOutcome} from "../boxrec-pages/event/boxrec.event.constants";
import {BoxrecTitles} from "./boxrec-common.constants";

const cheerio: CheerioAPI = require("cheerio");

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
     * Returns the boxer's division
     * This value can be missing
     * @hidden
     * @returns {WeightDivision | null}
     */
    static parseDivision(htmlString: string): WeightDivision | null {
        let division: string = trimRemoveLineBreaks(htmlString);
        division = division.toLowerCase();

        if (Object.values(WeightDivision).includes(division)) {
            return division as WeightDivision;
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
                const id: number = parseInt(matches[1], 10);
                let name: string = $(elem).text();
                name = trimRemoveLineBreaks(name);

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
        const opponentLast6: Cheerio = $(htmlString);

        opponentLast6.find("div.last6").each((i: number, elem: CheerioElement) => {
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
     * @param {string} htmlString       passed in HTML string, more than likely the contents of an HTML table column
     * @param {number} linkToLookAt     Sometimes the format is `town, region, country`.  Other times it is `country, region, town`
     * @hidden
     * @returns {Location}
     */
    static parseLocationLink(htmlString: string, linkToLookAt: number = 0): Location {
        const location: Location = {
            country: null,
            id: null,
            region: null,
            town: null,
        };
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        const links: Cheerio = html.find("a");

        if (links.get(linkToLookAt)) {
            const link: CheerioElement = links.get(linkToLookAt);
            const matches: RegExpMatchArray | null = link.attribs.href.match(townRegionCountryRegex) as string[];

            if (matches) {
                const [, country, region, townId] = matches;

                if (links) {
                    const data: CheerioElement = link;
                    if (data) {
                        // if no `townId` exists, this innerText is not the `town` and is something else
                        const innerText: string | undefined = data.children[0].data;
                        if (townId && innerText) {
                            location.town = innerText;
                        }
                        location.country = country || null;
                        location.region = region || null;
                        location.id = parseInt(townId, 10) || null;
                    }
                }
            }
        }

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
        let formattedOutcome: WinLossDraw;

        switch (outcome) {
            case "W":
                formattedOutcome = WinLossDraw.win;
                break;
            case "D":
                formattedOutcome = WinLossDraw.draw;
                break;
            case "L":
                formattedOutcome = WinLossDraw.loss;
                break;
            case "S":
                formattedOutcome = WinLossDraw.scheduled;
                break;
            default:
                formattedOutcome = WinLossDraw.unknown;
        }

        return formattedOutcome;
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
                return BoxingBoutOutcome[outcomeByWayOf as any];
            }

            return outcomeByWayOf;
        }

        return null;
    }

    static parseRating(htmlString: string): number | null {
        const html: Cheerio = $(htmlString);
        let rating: number | null = null;
        const starRating: Cheerio = html.find(".starRating");

        if (starRating && starRating.get(0)) {
            const widthString: string = html.find(".starRating").get(0).attribs.style;

            if (widthString) {
                const regex: RegExp = /width:\s(\d+)%;/;
                const widthMatch: RegExpMatchArray | null = widthString.match(regex);

                if (widthMatch && widthMatch[1]) {
                    rating = parseInt(widthMatch[1], 10);
                }
            }
        }

        return rating;
    }

    /*    static parseBoxerRating(rating: string): Array<number | null> {
            const ratings: Array<number | null> = [null, null];
            const ratingsMatch: RegExpMatchArray | null = trimRemoveLineBreaks(rating)
                .replace(/,/g, "")
                .match(/^(\d{1,5})&#x279E;(\d{1,5})$/);

            if (ratingsMatch) {
                ratings[0] = parseInt(ratingsMatch[1], 10);
                ratings[1] = parseInt(ratingsMatch[2], 10);
            }

            return ratings;
        }*/

    static parseRecord(htmlString: string): Record {
        const record: Record = {
            draw: null,
            loss: null,
            win: null,
        };
        const html: Cheerio = $(`<div>${htmlString}</div>`);

        if (html.find(".textWon") && !htmlString.includes("debut")) { // has fought/or fighter picked
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
        const referee: BoxrecBasic = {
            id: null,
            name: null,
        };

        html.find("a").each((index: number, elem: CheerioElement) => {
            const href: string = $(elem).get(0).attribs.href;
            const matches: RegExpMatchArray | null = href.match(/referee\/(\d+)$/);

            if (matches && matches[1]) {
                const id: number = parseInt(matches[1], 10);
                let name: string = $(elem).text();
                name = trimRemoveLineBreaks(name);

                referee.id = id;
                referee.name = name;
            }
        });

        return referee;
    }

    /**
     * @hidden
     */
    static parseTitles(htmlString: string): BoxrecTitles[] {
        const titles: BoxrecTitles[] = [];
        const html: Cheerio = $(`<div>${htmlString}</div>`);
        let titleIndexAt: number = 0;

        html.find("a").each((index: number, elem: CheerioElement) => {
            const {class: className, href} = $(elem).get(0).attribs;

            if (className && className.includes("titleLink")) {
                const matches: RegExpMatchArray | null = href.match(/(\d+\/\w+)$/);

                if (matches && matches[1]) {
                    const id: string = matches[1];
                    let name: string = $(elem).text();
                    name = trimRemoveLineBreaks(name);

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
                        name: $(elem).text(),
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

    /**
     * @hidden
     */
    private parseNumberOfRounds(htmlString: string): Array<number | null> {
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

}
